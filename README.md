## Description
NextAuth.js authentication demo.
This app is made for experiencing the authentication which is one of the important parts of web development. I made it as end product level as I can.

### Features
- Authentication with credentials.
- Authentication with Google account (OAuth).
- Custom signin and signup pages.
- Email verification.
- Password resetting.
- Profile page displaying and changing.
- Role-based authorization.
- Basic administration page.

## Getting Started  

### Initialize the App
First, initialize the app by running:
```bash
npm install
```
### .env.local 
- **MONGODB_URL:** MongoDB used at app. Your connection URL to MongoDB store.
- **NEXTAUTH_URL:** App's main URL. At development it is [http://localhost:3000](http://localhost:3000)
- **NEXTAUTH_SECRET:** This is a random string at base64 format. You can use openssl. First you need to install openssl. And run bottom command at cmd for generating the random string.
```bash
openssl rand -base64 32
```
- **EMAIL_VERIFICATION_SECRET:** This is random base64 string too. Use upper command to generate new one. Used generating JWT for email verification link.
- **EMAIL_VERIFICATION_SENDER:** This is a gmail address for email sending. Used at Nodemailer's auth.user. Gmail service used for this service. In this case it's gmail address. You can use your own prefered email sending service.
- **EMAIL_VERIFICATION_SENDER_PASS:** This is Nodemailer's auth.pass. Gmail gives error when enter gmail accounts normal password. You have to activate 2FA for your account, and generate an 'APP KEY' from 2FA tab. You should use that key as password. In this case paste to this .env.local attribute. If you use another email sending service just paste here your password.
- **Note:** This last two used in this file:"/src/email_sending_service/email_sending_service.ts/" You can check and make your configurations if it's needed.
- **RESET_PASSWORD_SECRET:** This is also random base64 string. Used at reset password for generating JWT.
- **GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:** These are Google OAuth service keys. I recommend go with this [tutorial](https://youtu.be/A53T9_V8aFk?t=203) to handle this part.

### Start App 
Start the app by running:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).
Your demo is ready. 😓😄
