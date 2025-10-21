import axios from "axios";

export const sendMail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.SMTP_FROM },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      },
    );

    console.log("✅ Email sent successfully:", response.status);
    return response.data;
  } catch (err) {
    console.error(
      "❌ Failed to send email:",
      err.response?.data || err.message,
    );
    throw err;
  }
};
