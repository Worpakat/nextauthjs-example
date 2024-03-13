import { createTransport } from "nodemailer";

interface IMailContent {
    subject: string,
    content: string
}

export class EmailSendingService {
    static transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_VERIFICATION_SENDER,
            pass: process.env.EMAIL_VERIFICATION_SENDER_PASS
        }
    })

    /**General email sender method.*/
    private static async sendEmail(recipient: string, mailContent: IMailContent) {
        const mailOptions = {
            from: process.env.EMAIL_VERIFICATION_SENDER,
            to: recipient,
            subject: mailContent.subject, // Subject line
            html: mailContent.content // HTML body
        }
        let result: "success" | "failure" | undefined;

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                result = "failure"
            } else {
                console.log('Email sent:', info.response);
                result = "success"
            }
        })

        return result
    }

    /**Sends an verification email with verification URL. */
    public static sendEmailVerificationMail(recipient: string, verificationUrl: string) {
        const mailContent: IMailContent = {
            subject: "Email Verification.",
            content: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification - NextAuthJsExample</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="font-sans bg-mainBG p-4">
                <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h1 class="text-primary text-center text-2xl font-semibold mb-6">NextAuthJsExample Email Verification</h1>
                    <p class="text-gray-700 text-lg mb-4">Hello,</p>
                    <p class="text-gray-700 text-lg mb-4">Thank you for signing up with NextAuthJsExample! To complete your registration, please verify your email address by clicking the link below:</p>
                    <div class="text-center mt-6">
                        <a href="${verificationUrl}" class="inline-block bg-accent.DEFAULT text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-accent.dark transition duration-300">Verify Email Address</a>
                    </div>
                    <p class="text-gray-700 text-lg mt-6">If you did not sign up for an account on NextAuthJsExample, you can safely ignore this email.</p>
                    <p class="text-gray-700 text-lg mt-4">Regards,<br>NextAuthJsExample Team</p>
                </div>
            </body>
            </html>`
        }

        try {
            this.sendEmail(recipient, mailContent);

        } catch (error: Error | any) {
            console.log(error);
        }
    }

    /**Sends an reset password email with URL to reset  */
    public static sendResetPasswordMail(recipient: string, resetPasswordURL: string) {
        const mailContent: IMailContent = {
            subject: "Reset Password.",
            content: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - NextAuthJsExample</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="font-sans bg-mainBG p-4">
                <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h1 class="text-primary text-center text-2xl font-semibold mb-6">NextAuthJsExample Password Reset</h1>
                    <p class="text-gray-700 text-lg mb-4">Hello,</p>
                    <p class="text-gray-700 text-lg mb-4">You are receiving this email because a password reset request was initiated for your account. If you did not request a password reset, no further action is required.</p>
                    <div class="text-center mt-6">
                        <a href="${resetPasswordURL}" class="inline-block bg-accent.DEFAULT text-white py-2 px-6 rounded-md text-lg font-semibold hover:bg-accent.dark transition duration-300">Reset Password</a>
                    </div>
                    <p class="text-gray-700 text-lg mt-6">If you did not request a password reset or need further assistance, please contact our support team.</p>
                    <p class="text-gray-700 text-lg mt-4">Regards,<br>NextAuthJsExample Team</p>
                </div>
            </body>
            </html>`
        }

        try {
            this.sendEmail(recipient, mailContent);

        } catch (error: Error | any) {
            console.log(error);
        }
    }
}