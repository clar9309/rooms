import { EmailData } from "@/app/_models/email";
import nodemailer from "nodemailer";

export async function sendEmail(emailData: EmailData) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "freja400d@gmail.com",
      pass: "qksidrofwqyfmooi",
    },
  });

  try {
    const mailOptions = {
      from: "freja400d@gmail.com",
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };
    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
  });
    return { status: 200 }
    
  } catch (error) {
    console.error("Error sending email:", error);
      return { status: 500 }

  }
}
