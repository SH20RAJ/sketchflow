// Email sending utility using Resend
import { Resend } from 'resend';

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY || 're_AW4gabBN_6W7cTVBDYSmVugxyFLsqoQM5';
const resend = new Resend(resendApiKey);

/**
 * Send an email using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email or array of emails
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content (optional)
 * @param {string} options.html - HTML email content
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Convert single email to array if needed
    const recipients = Array.isArray(to) ? to : [to];

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'SketchFlow <onboarding@resend.dev>',
      to: recipients,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent with Resend:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    // Don't throw the error, just log it and return null
    // This prevents the API from failing if email sending fails
    return null;
  }
};

// For development, log the email details
export const logEmailDetails = (emailData) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Email would be sent in production:');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Content:', emailData.html || emailData.text);
  }
  return null;
};