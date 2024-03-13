import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { DBService } from "@/db_service/db_service";
import { options } from "../../auth/[...nextauth]/options";
import { checkFieldsAreOk, invalidChangePasswordRequest, invalidUserResponse } from "../../utils";

/**Handles profile password changing operations.*/
export async function PATCH(request: NextRequest) {
    try {
        const changePasswordReqData = await request.json();

        //Check required fields.
        if (!checkFieldsAreOk(changePasswordReqData)) return invalidChangePasswordRequest();

        const session = await getServerSession(options);
        if (!session || session.user.id !== changePasswordReqData.id)
            return invalidUserResponse();
        //Neither user unauthenticated or authenticated user and requested user don't match.

        //Password confirmation matching control.
        if (changePasswordReqData.newPassword !== changePasswordReqData.confirmPassword)
            return NextResponse.json({ result: "failure", message: "New password and confirmation password don't matches." }, {
                headers: { "Content-Type": "application/json" },
                status: 400
            })

        const result = await DBService.changeUserPassword(
            changePasswordReqData.id,
            changePasswordReqData.oldPassword,
            changePasswordReqData.newPassword);

        switch (result) {
            case "wrongPass":
                return NextResponse.json(
                    { result: "failure", message: "Old password is wrong." },
                    {
                        headers: { "Content-Type": "application/json" },
                        status: 401
                    }
                )
            case null:
                return invalidUserResponse();
            case "success":
                return NextResponse.json(
                    { result: "success", message: "Password has been changed successfully." },
                    {
                        headers: { "Content-Type": "application/json" },
                        status: 201
                    }
                );

            default:
                throw result as Error
        }
    } catch (error) {
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 })
    }
}

