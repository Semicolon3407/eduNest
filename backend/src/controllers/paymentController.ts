import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import crypto from 'crypto';
import Student from '../models/Student';
import EsewaTransaction from '../models/EsewaTransaction';
import FeeRecord from '../models/FeeRecord';
import mongoose from 'mongoose';

// eSewa UAT credentials
const ESEWA_SECRET = '8gBm/:&EnhH.1/q'; 
const ESEWA_PRODUCT_CODE = 'EPAYTEST';
const ESEWA_UAT_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_STATUS_CHECK_URL = 'https://rc.esewa.com.np/api/epay/transaction/status/';

const SUCCESS_URL = process.env.ESEWA_SUCCESS_URL || 'http://localhost:5173/payment-success';
const FAILURE_URL = process.env.ESEWA_FAILURE_URL || 'http://localhost:5173/payment-failure';

const generateSignature = (message: string): string => {
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET);
  hmac.update(message);
  return hmac.digest('base64');
};

export const initiateEsewaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, feeRecordId } = req.body;
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Formatting amount to be a string without unnecessary decimals if it's an integer
    // Some eSewa environments are extremely picky about this.
    const amountStr = amount.toString();
    
    // Using a simpler transaction UUID format
    const transactionUuid = `${Date.now()}`;
    
    // Formula: total_amount=VAL,transaction_uuid=VAL,product_code=VAL
    const signatureString = `total_amount=${amountStr},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    const signature = generateSignature(signatureString);

    const isRealRecord = feeRecordId && mongoose.Types.ObjectId.isValid(feeRecordId);
    
    await EsewaTransaction.create({
      student: student._id,
      feeRecord: isRealRecord ? feeRecordId : undefined,
      amount: Number(amount),
      transactionUuid,
      signature,
      organization: req.user.organization,
      metadata: !isRealRecord ? { virtualFeeId: feeRecordId } : undefined
    });

    if (isRealRecord) {
      await FeeRecord.findByIdAndUpdate(feeRecordId, {
        transactionUuid: transactionUuid,
        method: 'eSewa'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        amount: amountStr,
        tax_amount: "0",
        total_amount: amountStr,
        transaction_uuid: transactionUuid,
        product_code: ESEWA_PRODUCT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: SUCCESS_URL,
        failure_url: FAILURE_URL,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEsewaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { data } = req.query;
    const dataStr = data as string;
    if (!dataStr) return res.status(400).json({ success: false, message: 'Invalid data provided' });

    const decoded = JSON.parse(Buffer.from(dataStr, 'base64').toString());
    const { status, transaction_uuid, transaction_code, total_amount, signed_field_names, signature } = decoded;

    // Verify signature integrity
    const message = signed_field_names.split(',').map((field: string) => {
      return `${field}=${decoded[field]}`;
    }).join(',');
    
    const expectedSignature = generateSignature(message);

    if (signature !== expectedSignature) {
      console.error('Signature mismatch!', { received: signature, expected: expectedSignature, message });
      return res.status(400).json({ success: false, message: 'Invalid payload signature' });
    }

    const transaction = await EsewaTransaction.findOne({ transactionUuid: transaction_uuid });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction record not found' });

    if (status === 'COMPLETE') {
      transaction.status = 'Completed';
      transaction.metadata = { ...transaction.metadata, esewa_ref_id: transaction_code };
      await transaction.save();

      const student = await Student.findById(transaction.student);

      if (transaction.feeRecord) {
        await FeeRecord.findByIdAndUpdate(transaction.feeRecord, {
          status: 'Paid',
          method: 'eSewa',
          transactionId: transaction_code,
          date: new Date()
        });
      } else {
        // Populate student to get branch
        const populatedStudent = await Student.findById(transaction.student).populate('branch');
        const description = transaction.metadata?.virtualFeeId 
          ? `Monthly Fee (eSewa) - ${transaction.metadata.virtualFeeId}`
          : `eSewa Payment - Ref: ${transaction_code}`;

        await FeeRecord.create({
          student: transaction.student,
          description,
          amount: transaction.amount,
          status: 'Paid',
          method: 'eSewa',
          transactionId: transaction_code,
          organization: transaction.organization,
          branch: populatedStudent?.branch,
          date: new Date()
        });
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      transaction.status = 'Failed';
      await transaction.save();
      res.status(400).json({ success: false, message: `Payment failed with status: ${status}` });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const checkEsewaStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { transaction_uuid, total_amount } = req.query;
    if (!transaction_uuid || !total_amount) {
      return res.status(400).json({ success: false, message: 'Missing transaction parameters' });
    }

    const url = `${ESEWA_STATUS_CHECK_URL}?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;
    
    // Using native fetch or axios if available. Since it's backend, we can use dynamic import or require
    // or just assume global fetch is available (Node 18+)
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'COMPLETE') {
      // Update transaction in background if it's not already completed
      const transaction = await EsewaTransaction.findOne({ transactionUuid: transaction_uuid as string });
      if (transaction && transaction.status !== 'Completed') {
        transaction.status = 'Completed';
        transaction.metadata = { ...transaction.metadata, esewa_ref_id: data.ref_id };
        await transaction.save();
        
        // Also update FeeRecord if applicable
        if (transaction.feeRecord) {
          await FeeRecord.findByIdAndUpdate(transaction.feeRecord, {
            status: 'Paid',
            method: 'eSewa',
            transactionId: data.ref_id,
            date: new Date()
          });
        } else {
          // Create a new FeeRecord if none existed (virtual fee payment via status check)
          const populatedStudent = await Student.findById(transaction.student).populate('branch');
          const existingRecord = await FeeRecord.findOne({ transactionId: data.ref_id });
          if (!existingRecord) {
            await FeeRecord.create({
              student: transaction.student,
              description: `eSewa Payment - Ref: ${data.ref_id}`,
              amount: transaction.amount,
              status: 'Paid',
              method: 'eSewa',
              transactionId: data.ref_id,
              organization: transaction.organization,
              branch: populatedStudent?.branch,
              date: new Date()
            });
          }
        }
      }
    }

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
