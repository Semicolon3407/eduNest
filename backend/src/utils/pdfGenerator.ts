import PDFDocument from 'pdfkit';
import { Response } from 'express';

export const generateReceiptPDF = (res: Response, data: any) => {
  const doc = new PDFDocument();

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=receipt-${data.id}.pdf`);

  doc.pipe(res);

  // Content
  doc.fontSize(25).text('eduNest - Fee Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Receipt ID: ${data.id}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();
  doc.text(`Student Name: ${data.studentName}`);
  doc.text(`Organization: ${data.orgName}`);
  doc.moveDown();
  doc.text(`Amount Paid: ${data.currency} ${data.amount}`);
  doc.text(`Payment Method: ${data.method}`);
  doc.moveDown();
  doc.text('Thank you for your payment!', { align: 'center' });

  doc.end();
};
