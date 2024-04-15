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
      return res.status(404).send("User not found.");
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await User.saveResetToken(user.id, token, expiration);

    const resetLink = `http://localhost:3000/reset-password/${token}`;
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

    res.send("Reset password link sent.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

// Handles requests to reset a password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findByResetToken(token);
    if (!user || new Date() > new Date(user.resetTokenExpiration)) {
      return res.status(400).send("Invalid or expired token.");
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).send("New password cannot be the same as the old password.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(user.id, hashedPassword);

    res.send("Password has been reset successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

module.exports = {
  sendResetEmail,
  resetPassword,
};

