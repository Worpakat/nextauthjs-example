import { ValidationFailureTypes } from "@/validation_service/failures";
import { NextResponse } from "next/server";

//API Util functions

export const invalidUserResponse = () => NextResponse.json({ result: "failure", message: "User not found." }, { status: 400 });
export const invalidEmailResponse = () => NextResponse.json({ result: "failure", message: "Invalid email address." }, { status: 400 });
export const invalidUpdateRequest = () => NextResponse.json({ result: "failure", message: "Invalid user update request." }, { status: 400 });
export const invalidResetPasswordRequest = () => NextResponse.json({ result: "failure", message: "Invalid reset password request." }, { status: 400 });
export const invalidChangePasswordRequest = () => NextResponse.json({ result: "failure", message: "Invalid change password request." }, { status: 400 });
export const unauthorizedResponse = () => NextResponse.json({ result: "failure", message: "You're unauthorized to access this endpoint. You should be authenticated." }, { status: 403 });
export const alreadyVerifiedResponse = () => NextResponse.json({ result: "failure", message: "Your email is already verified." }, { status: 409 });
export const linkIsInvalidResponse = (status: number) => NextResponse.json({ result: "failure", message: "Reset password link is invalid, please send a new reset password link." }, { status });
export const invalidRequestResponse = () => NextResponse.json({ result: "failure", message: "Invalid request body" }, { status: 400 });


export const checkFieldsAreOk = (changePasswordData: any) => {
    return (('id' in changePasswordData) &&
        ('oldPassword' in changePasswordData) &&
        ('newPassword' in changePasswordData) &&
        ('confirmPassword' in changePasswordData) &&
        changePasswordData);
}

export const getFailureResponse = (failureType: ValidationFailureTypes) => {
    return NextResponse.json({
        result: "failure",
        message: failureType
    },
        { status: 400 }
    )
}