global.WebTransportError = global.WebTransportError || class {};

import Brevo from "@getbrevo/brevo";

const { SMTP_PASSWORD, SMTP_FROM } = process.env;

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = SMTP_PASSWORD;

export const sendMail = async ({ to, subject, html }) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Emirhan", email: SMTP_FROM };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", response);
    return response;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw new Error("Failed to send the email, please try again later.");
  }
};
