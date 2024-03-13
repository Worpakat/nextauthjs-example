import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { DBService } from "@/db_service/db_service";
import { sign, verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { options } from "../../auth/[...nextauth]/options";
import { alreadyVerifiedResponse, invalidUserResponse, unauthorizedResponse } from "../../utils";
import { EmailSendingService } from "@/email_sending_service/email_sending_service";

/**Request end-point for sending verifacation mail to user's email address.*/
export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get("userId");

        const session = await getServerSession(options);

        if (!session) return unauthorizedResponse();
        if (session.user.email_verified) return alreadyVerifiedResponse();
        if (session.user.id !== userId) return invalidUserResponse();

        const secret = process.env.EMAIL_VERIFICATION_SECRET as string
        const email = session.user.email;
        const token = sign({ userId }, secret + email, { expiresIn: "1h" })

        const result = await DBService.addEmailVerificationToken(userId, token);
        if (result instanceof Error) throw result;
        if (!result) throw new Error();

        const verificationUrl = `http://localhost:3000/profile/verify-email?token=${token}`;
        EmailSendingService.sendEmailVerificationMail(session.user.email, verificationUrl);

        return NextResponse.json({ result: "success" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 })
    }
}

/**Request end-point for completing the email verification. */
export async function PATCH(request: NextRequest) {
    try {
        const tokenData = await request.json();
        const session = await getServerSession(options);

        if (!session) return unauthorizedResponse();
        if (session.user.email_verified) return alreadyVerifiedResponse();

        //Token verification
        const secret = process.env.EMAIL_VERIFICATION_SECRET as string
        const email = session.user.email;
        const decodedToken = verify(tokenData.token, secret + email);
        if (typeof decodedToken === 'string')  //Token invalid.
            return NextResponse.json({ result: "failure", message: "Verification link invalid. Please click again to verification link from email." },
                { status: 401 });

        if (session.user.id !== decodedToken.userId) return invalidUserResponse();

        //Get user with userId that decoded from token.
        const result = await DBService.getEmailVerificationToken(decodedToken.userId);
        if (result instanceof Error) throw result;
        if (!result) return invalidUserResponse(); //User not found.
        if (result === "token does not exist")
            return NextResponse.json({ result: "failure", message: "Verification token not found, please send a new verification email from your profile page." },
                { status: 500 });

        //Check if signed tokens matches too, for extra security.
        if (result !== tokenData.token) //Tokens do not match.
            return NextResponse.json({ result: "failure", message: "Tokens do not match. please send a new verification email from your profile page." },
                { status: 401 });

        const verifyResult = await DBService.verifyEmail(session.user.id);
        if (verifyResult instanceof Error) throw result;
        if (!verifyResult) return invalidUserResponse(); //User not found.

        return NextResponse.json({ result: "success" }, { status: 200 })

    } catch (error: Error | any) {
        console.log(error);


        if (error instanceof TokenExpiredError)
            return NextResponse.json({ result: "failure", message: "Verification email is expired. You can send a new verification email from profile page" },
                { status: 401 });
        if (error instanceof JsonWebTokenError)
            return NextResponse.json({ result: "failure", message: "Email could not be verified. Please click again to verification link from email." },
                { status: 500 });

        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 });
    }
}
