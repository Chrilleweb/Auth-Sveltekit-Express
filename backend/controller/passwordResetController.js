const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Configure Nodemailer to use Mailgun SMTP for sending emails
let transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: "postmaster@sandbox396c2341a93745168ba720519280e9a3.mailgun.org",
    pass: process.env.MAILGUN_PASS,
  },
});

// Handles requests to send a password reset email
const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await User.saveResetToken(user.id, token, expiration);

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body>
        <p>Hello,</p>
        <p>You requested a password reset. Please click the link below to set a new password. If you did not request this, please ignore this email.</p>
        <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
        <p>Thank you!</p>
    </body>
    </html>`;

    await transporter.sendMail({
      from: "\"Chrille\" <postmaster@sandbox396c2341a93745168ba720519280e9a3.mailgun.org>",
      to: email,
      subject: "Password Reset",
      html: emailHtml,
    });

    res.status(200).json({ message: `Email sent to ${email}. Please check your email to reset your password.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
};

// Handles requests to reset a password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findByResetToken(token);
    if (!user || new Date() > new Date(user.resetTokenExpiration)) {
      return res.status(400).json({ message: "Invalid or Expired token" });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    // Validate password length
    if (newPassword.length < 6 || newPassword.length > 20) {
      return res.status(400).json({ message: "Password must be between 6 and 20 characters long" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(user.id, hashedPassword);

    res.status(200).json({ message: "Password has been reset successfully. " });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  sendResetEmail,
  resetPassword,
};

