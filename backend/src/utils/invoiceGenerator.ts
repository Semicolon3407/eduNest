import PDFDocument from 'pdfkit';
import sendEmail from './sendEmail';
import { IStudent } from '../models/Student';
import { IFeeRecord } from '../models/FeeRecord';

export const generateAndSendInvoice = async (student: any, record: any) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: any[] = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    return new Promise((resolve, reject) => {
      doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        
        try {
          await sendEmail({
            email: student.personalEmail || student.studentEmail,
            subject: `Payment Confirmation & Invoice - ${record.description}`,
            message: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px; color: #1e293b;">
                <h2 style="color: #6366f1; text-align: center;">Payment Successful!</h2>
                <p>Dear <b>${student.firstName} ${student.lastName}</b>,</p>
                <p>Thank you for your payment. Your transaction has been successfully processed. Please find your official invoice attached to this email.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 25px 0; border: 1px solid #f1f5f9;">
                  <p style="margin: 8px 0;"><b>Description:</b> ${record.description}</p>
                  <p style="margin: 8px 0;"><b>Amount Paid:</b> Rs. ${record.amount.toLocaleString()}</p>
                  <p style="margin: 8px 0;"><b>Transaction ID:</b> ${record.transactionId}</p>
                  <p style="margin: 8px 0;"><b>Payment Method:</b> eSewa</p>
                </div>
                
                <p style="font-size: 0.9em; line-height: 1.6;">This is an automated receipt for your institutional records. If you have any questions, please contact the accounts department.</p>
                
                <p style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
                  EduNest Institutional Fee Management System
                </p>
              </div>
            `,
            attachments: [
              {
                filename: `Invoice_${record.transactionId}.pdf`,
                content: pdfData
              }
            ]
          });
          resolve(true);
        } catch (err) {
          console.error('Failed to send invoice email:', err);
          reject(err);
        }
      });

      // --- PDF CONTENT ---
      // Header
      doc.fillColor('#444444')
         .fontSize(20)
         .text('EDUNEST ERP', 50, 57)
         .fontSize(10)
         .text('Official Payment Receipt', 50, 80)
         .text(`Date: ${new Date().toLocaleDateString()}`, 200, 65, { align: 'right' })
         .text(`Receipt No: ${record.transactionId}`, 200, 80, { align: 'right' })
         .moveDown();

      // Divider
      doc.moveTo(50, 100).lineTo(550, 100).stroke();

      // Student Details
      doc.fontSize(12)
         .text('Student Details:', 50, 120)
         .fontSize(10)
         .text(`Name: ${student.firstName} ${student.lastName}`, 50, 140)
         .text(`Admission No: ${student.admissionNumber || 'N/A'}`, 50, 155)
         .text(`Class: ${student.class?.name || 'N/A'}`, 50, 170);

      // Payment Details Table
      const tableTop = 220;
      doc.fontSize(12).text('Description', 50, tableTop);
      doc.text('Amount', 400, tableTop, { align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      
      doc.fontSize(10)
         .text(record.description, 50, tableTop + 30)
         .text(`Rs. ${record.amount.toLocaleString()}`, 400, tableTop + 30, { align: 'right' });

      doc.moveTo(50, tableTop + 50).lineTo(550, tableTop + 50).stroke();

      // Total
      doc.fontSize(12)
         .text('TOTAL PAID', 50, tableTop + 70)
         .text(`Rs. ${record.amount.toLocaleString()}`, 400, tableTop + 70, { align: 'right' });

      // Footer
      doc.fontSize(10)
         .fillColor('#777777')
         .text('Thank you for your payment. This is a computer-generated receipt and does not require a signature.', 50, 700, { align: 'center', width: 500 });

      doc.end();
    });
  } catch (error) {
    console.error('Invoice Generation Error:', error);
  }
};
