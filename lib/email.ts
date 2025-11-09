// Email service using Resend
import { Resend } from 'resend';

// Initialize Resend only if API key is present to avoid build-time error
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default to Resend sandbox sender to avoid domain verification errors in non-production envs
const FROM_EMAIL = process.env.EMAIL_FROM || 'FinTrackrX <onboarding@resend.dev>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const emailService = {
  async sendVerificationEmail(to: string, name: string, token: string) {
    const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

    if (!resend) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Verify your FinTrackrX account',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to FinTrackrX!</h1>
                </div>
                <div class="content">
                  <p>Hi ${name},</p>
                  <p>Thanks for signing up! Please verify your email address to get started with FinTrackrX.</p>
                  <p style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                  </p>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                  <p>This link will expire in 24 hours.</p>
                  <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} FinTrackrX. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    if (!resend) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Reset your FinTrackrX password',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                  <p>Hi ${name},</p>
                  <p>We received a request to reset your password for your FinTrackrX account.</p>
                  <p style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                  </p>
                  <p>Or copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
                  <p>This link will expire in 1 hour.</p>
                  <p><strong>If you didn't request this,</strong> please ignore this email and your password will remain unchanged.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} FinTrackrX. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  async sendTransactionAlert(to: string, name: string, transaction: {
    type: string;
    amount: number;
    description: string;
    date: string;
  }) {
    if (!resend) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `Transaction Alert: ${transaction.type === 'expense' ? '-' : '+'}₹${transaction.amount}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: ${transaction.type === 'expense' ? '#ef4444' : '#10b981'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .amount { font-size: 32px; font-weight: bold; color: ${transaction.type === 'expense' ? '#ef4444' : '#10b981'}; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${transaction.type === 'expense' ? '💸' : '💰'} Transaction Alert</h1>
                </div>
                <div class="content">
                  <p>Hi ${name},</p>
                  <p>A new ${transaction.type} has been recorded:</p>
                  <p class="amount">${transaction.type === 'expense' ? '-' : '+'}₹${transaction.amount}</p>
                  <p><strong>Description:</strong> ${transaction.description}</p>
                  <p><strong>Date:</strong> ${transaction.date}</p>
                  <p style="text-align: center; margin-top: 30px;">
                    <a href="${APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">View Dashboard</a>
                  </p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} FinTrackrX. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  async sendBudgetAlert(to: string, name: string, budget: {
    name: string;
    spent: number;
    limit: number;
    percentage: number;
  }) {
    if (!resend) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `Budget Alert: ${budget.name} at ${budget.percentage}%`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .progress-bar { height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; background: ${budget.percentage >= 90 ? '#ef4444' : '#f59e0b'}; }
                .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>⚠️ Budget Alert</h1>
                </div>
                <div class="content">
                  <p>Hi ${name},</p>
                  <p>Your <strong>${budget.name}</strong> budget is at <strong>${budget.percentage}%</strong></p>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${budget.percentage}%"></div>
                  </div>
                  <p style="margin-top: 20px;">
                    <strong>Spent:</strong> ₹${budget.spent.toLocaleString()}<br>
                    <strong>Budget:</strong> ₹${budget.limit.toLocaleString()}<br>
                    <strong>Remaining:</strong> ₹${(budget.limit - budget.spent).toLocaleString()}
                  </p>
                  ${budget.percentage >= 90 ? '<p style="color: #ef4444;"><strong>Warning:</strong> You\'re close to exceeding your budget!</p>' : ''}
                  <p style="text-align: center; margin-top: 30px;">
                    <a href="${APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">View Budget Details</a>
                  </p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} FinTrackrX. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  },

  async sendMfaEmailCode(to: string, name: string | undefined, code: string) {
    if (!resend) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: 'Your FinTrackrX sign-in code',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; background: #f9fafb; }
                .container { max-width: 560px; margin: 0 auto; padding: 20px; }
                .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: white; padding: 24px; text-align: center; }
                .content { padding: 24px; }
                .code { font-size: 32px; font-weight: 700; letter-spacing: 6px; background: #f3f4f6; padding: 12px 16px; border-radius: 8px; text-align: center; }
                .muted { color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="card">
                  <div class="header">
                    <h1>Sign-in code</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${name || 'there'},</p>
                    <p>Use the following code to finish signing in to FinTrackrX:</p>
                    <div class="code">${code}</div>
                    <p class="muted">This code expires in 10 minutes. If you didn’t request it, you can ignore this email.</p>
                  </div>
                </div>
                <p class="muted" style="text-align:center;margin-top:12px;">&copy; ${new Date().getFullYear()} FinTrackrX</p>
              </div>
            </body>
          </html>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Email send error (MFA code):', error);
      return { success: false, error };
    }
  },
};
