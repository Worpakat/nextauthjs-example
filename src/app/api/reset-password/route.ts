import { NextRequest, NextResponse } from "next/server";
import { DBService } from "@/db_service/db_service";
import { EmailSendingService } from "@/email_sending_service/email_sending_service";
import { getFailureResponse, invalidEmailResponse, invalidResetPasswordRequest, invalidUserResponse, linkIsInvalidResponse } from "../utils";
import { CredentialValidationService } from "@/validation_service/validation_service";
import { JsonWebTokenError, TokenExpiredError, sign, verify } from "jsonwebtoken";
import { ValidationFailureTypes } from "@/validation_service/failures";

/**Request end-point for sending reset password email. */
export async function POST(request: NextRequest) {
    try {
        const emailData = await request.json();
        const email = emailData.email;

        //Check if fields filled.
        if (!email || typeof email !== 'string') return invalidEmailResponse();
        //Check if email is in email format.
        if (!CredentialValidationService.validateEmailFormat(email)) return invalidEmailResponse();

        //Generate JWT.
        const secret = process.env.RESET_PASSWORD_SECRET as string
        const token = sign({ email }, secret, { expiresIn: "1h" })

        //DB operations.
        const result = await DBService.handleForgotPasswordDBOperations(email, token);
        if (result instanceof Error) throw result;
        if (!result) return invalidUserResponse();
        // result === "success"

        //Send email.
        const resetPasswordURL = `http://localhost:3000/reset-password?token=${token}`;
        EmailSendingService.sendResetPasswordMail(email, resetPasswordURL);

        return NextResponse.json({ result: "success" }, { status: 200 })

    } catch (error: Error | any) {
        console.log(error);
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 });
    }
}

/**Request end-point for reset password. */
export async function PATCH(request: NextRequest) {
    try {
        const resetPasswordData = await request.json();

        if (!resetPasswordData.token) { return invalidResetPasswordRequest(); }
        if (!resetPasswordData.newPassword) { return getFailureResponse(ValidationFailureTypes.EMPTY_FIELD); }

        if (!CredentialValidationService.validatePasswordRequirements(resetPasswordData.newPassword)) {
            return getFailureResponse(ValidationFailureTypes.PASS_REQUIREMENT);
        }

        //Token verification
        const secret = process.env.RESET_PASSWORD_SECRET as string
        const decodedToken = verify(resetPasswordData.token, secret);
        if (typeof decodedToken === 'string')  //Token invalid.
            return linkIsInvalidResponse(401);

        // Get user with email that decoded from token.
        const result = await DBService.handleResetPasswordDBOperations(decodedToken.email, resetPasswordData.token, resetPasswordData.newPassword);
        if (result instanceof Error) throw result;
        if (!result) return invalidUserResponse(); //User not found.
        if (result === "token does not exist") return linkIsInvalidResponse(500);
        if (result === "tokens dont match") return linkIsInvalidResponse(401);

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