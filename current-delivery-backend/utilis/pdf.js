const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


async function generateInvoicePDF({ shipment, invoiceNumber }) {
const dir = process.env.INVOICES_DIR || 'invoices';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const fileName = `${invoiceNumber}.pdf`;
const filePath = path.join(dir, fileName);
const doc = new PDFDocument({ margin: 40 });


return new Promise((resolve, reject) => {
const stream = fs.createWriteStream(filePath);
doc.pipe(stream);


doc.fontSize(18).text('Current Delivery - Invoice', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text(`Invoice #: ${invoiceNumber}`);
doc.text(`Tracking Code: ${shipment.trackingCode}`);
doc.text(`Date: ${new Date().toLocaleString()}`);
doc.moveDown();


doc.text('Sender:', { underline: true });
doc.text(`${shipment.sender.name}\n${shipment.sender.address}\n${shipment.sender.email} | ${shipment.sender.phone}`);
doc.moveDown();


doc.text('Recipient:', { underline: true });
doc.text(`${shipment.recipient.name}\n${shipment.recipient.address}\n${shipment.recipient.email} | ${shipment.recipient.phone}`);
doc.moveDown();


doc.text('Package Details:', { underline: true });
doc.text(`Description: ${shipment.package.description}`);
doc.text(`Weight: ${shipment.package.weight || '-'} kg`);
doc.text(`Price: $${shipment.price || '0.00'}`);


if (shipment.package.imageUrl) {
try {
const imgPath = path.join(__dirname, '..', shipment.package.imageUrl.replace(/^\//, ''));
if (fs.existsSync(imgPath)) {
doc.addPage();
doc.fontSize(14).text('Package Image', { align: 'center' });
doc.image(imgPath, { fit: [450, 450], align: 'center' });
}
} catch (e) { console.warn('image error', e); }
}


doc.end();


stream.on('finish', () => resolve({ filePath, pdfUrl: `/${(process.env.INVOICES_DIR || 'invoices')}/${fileName}` }));
stream.on('error', reject);
});
}


module.exports = { generateInvoicePDF };

