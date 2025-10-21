import "dotenv/config";
import { sendMail } from "./src/services/mailer.js";

const run = async () => {
  try {
    const info = await sendMail({
      to: "emirhanbuyuksenirli@gmail.com", // test için kendi mailin
      subject: "Test Mail - Node.js Brevo",
      html: "<h2>Merhaba Emirhan 👋</h2><p>Bu e-posta Node.js uygulamandan başarıyla gönderildi 🎉</p>",
    });

    console.log("✅ Mail başarıyla gönderildi!");
    console.log(info);
  } catch (error) {
    console.error("❌ Mail gönderilemedi:", error);
  }
};

run();
