const express5 = require('express');
const router5 = express5.Router();
const nodemailer = require('nodemailer');
const path5 = require('path');


async function sendInvoiceEmail(to, subject, html, attachments = []) {
const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
const info = await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html: html || 'Your invoice is attached', attachments });
return info;
}


router5.post('/send', async (req, res) => {
const { to, subject, html } = req.body;
try { const info = await sendInvoiceEmail(to, subject, html); res.json({ ok: true, info }); } catch (e) { res.status(500).json({ error: e.message }); }
});


module.exports = router5;
module.exports.sendInvoiceEmail = sendInvoiceEmail;

