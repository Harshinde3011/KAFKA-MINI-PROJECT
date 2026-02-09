import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendWelcomMail = async (email, username) => {
    if (!email) return;

    console.log("credentials: ",{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    });

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.gmail.com",
            port: process.env.PORT || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"My App" <harshshinde1922@gmial.com>',
            to: email,
            subject: "Welcome 🎉",
            text: `Hi ${username}, welcome to our platform!`,
        });
    } catch (error) {
        console.log("ERROR while sending the mail", error);
    }
}