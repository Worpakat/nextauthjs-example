import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { DBService } from "@/db_service/db_service";
import { invalidEmailResponse, invalidUpdateRequest, invalidUserResponse } from "../utils";
import { CredentialValidationService } from "@/validation_service/validation_service";

/**Returns user profile*/
export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get("userId");

        if (!userId) return invalidUserResponse();

        const session = await getServerSession(options);
        if (!session || session.user.id !== userId)
            return invalidUserResponse();
        //Neither user unauthenticated or authenticated user and requested user don't match.

        const userDocument = await DBService.getUserById(userId);
        if (!userDocument || userDocument instanceof Error) return invalidUserResponse();

        const userProfile: IUserProfile = {
            username: userDocument.name,
            email: userDocument.email,
            email_verified: userDocument.emailVerified,
            role: userDocument.role,
            imageURL: userDocument.image.URL,
            banned: userDocument.banned,
            birthday: userDocument.birthday
        }

        return NextResponse.json(
            { result: "success", message: "User has been got successfully.", userProfile },
            {
                headers: { "Content-Type": "application/json" },
                status: 200
            }
        );

    } catch (error) {
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 })
    }
}

/**Updates user profile/document.*/
export async function PATCH(request: NextRequest) {
    try {
        const profileUpdateReq = await request.json();

        //Check required fields.
        if (!('id' in profileUpdateReq) || !('email' in profileUpdateReq) || !profileUpdateReq) return invalidUpdateRequest();
        if (!CredentialValidationService.validateEmailFormat(profileUpdateReq.email)) return invalidEmailResponse();

        const session = await getServerSession(options);
        if (!session || session.user.id !== profileUpdateReq.id)
            return invalidUpdateRequest();
        //Neither user unauthenticated or authenticated user and requested user don't match.

        const profileUpdateDB: IProfileUpdateDBData = {
            name: profileUpdateReq.name,
            email: profileUpdateReq.email,
            birthday: profileUpdateReq.birthday
        }

        const result = await DBService.updateUserProfile(profileUpdateReq.id, profileUpdateDB)
        if (result instanceof Error) return invalidUpdateRequest();

        //User could not find. At normal site usage, this if branchs execution not possible. This is for outer and malicious requests.
        if (!result) return NextResponse.json({ result: "failure", message: "User could not been updated. Please refresh your page and try again." },
            {
                headers: { "Content-Type": "application/json" },
                status: 403
            })

        //Update process successfull.
        if (result === "email not changed") {
            return NextResponse.json(
                { result: "success", message: "Profile has been updated successfully but, email has not been changed." },
                {
                    headers: { "Content-Type": "application/json" },
                    status: 201
                });
        }

        const profileUpdateRes: IProfileUpdateResData = {
            id: result._id.toString(),
            name: profileUpdateReq.name,
            email: profileUpdateReq.email,
            email_verified: result.email_verified,
            birthday: profileUpdateReq.birthday
        }

        return NextResponse.json(
            { result: "success", message: "Profile has been updated successfully.", profileUpdateRes },
            {
                headers: { "Content-Type": "application/json" },
                status: 201
            }
        );

    } catch (error) {
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 })
    }
}

