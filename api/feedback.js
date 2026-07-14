const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, message, contact } = req.body;

  if (!message || message.trim().length < 2) {
    return res.status(400).json({ error: '请输入反馈内容' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.QQ_EMAIL,
        pass: process.env.QQ_AUTH_CODE,
      },
    });

    const senderName = name && name.trim() ? name.trim() : '匿名玩家';
    const contactInfo = contact && contact.trim() ? `\n联系方式: ${contact.trim()}` : '';

    await transporter.sendMail({
      from: process.env.QQ_EMAIL,
      to: process.env.QQ_EMAIL,
      subject: `充电模拟器 - 玩家反馈 (${senderName})`,
      text: `姓名: ${senderName}${contactInfo}\n\n留言:\n${message}`,
      html: `<div style="font-family:sans-serif;max-width:600px;padding:20px;">
        <h2 style="color:#7b68ee;">📬 充电模拟器 - 玩家反馈</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px 0;color:#888;width:80px;">姓名</td><td style="padding:8px 0;">${senderName}</td></tr>
          ${contact ? `<tr><td style="padding:8px 0;color:#888;">联系方式</td><td style="padding:8px 0;">${contact}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#888;vertical-align:top;">留言</td><td style="padding:8px 0;white-space:pre-wrap;">${message}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
        <p style="color:#aaa;font-size:12px;">来自 充电模拟器 (charger-simulator.top)</p>
      </div>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ error: '发送失败，请稍后再试' });
  }
};
