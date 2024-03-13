import { CredentialValidationService } from "@/validation_service/validation_service";
import { NextRequest, NextResponse } from "next/server";
import { ValidationFailureTypes } from "@/validation_service/failures";
import { DBService } from "@/db_service/db_service";
import { hash } from "bcryptjs";
import { getFailureResponse } from "../utils";

export async function POST(request: NextRequest) {
    try {
        const userCredentials = await request.json();
        const email = userCredentials.email;
        const password = userCredentials.password;

        //Check if fields filled.
        if (!email || !password) {
            return getFailureResponse(ValidationFailureTypes.EMPTY_FIELD);
        }        
        //Check credentials' type.
        if (!CredentialValidationService.validateCredentialTypes(email, password)) {
            return getFailureResponse(ValidationFailureTypes.CREDENTIAL_TYPE);
        }        
        //Check email format
        if (!CredentialValidationService.validateEmailFormat(email)) {
            return getFailureResponse(ValidationFailureTypes.EMAIL_FORMAT);
        }        
        //Check password requirements are met.
        if (!CredentialValidationService.validatePasswordRequirements(password)) {
            return getFailureResponse(ValidationFailureTypes.PASS_REQUIREMENT);
        }

        const emailExists = await DBService.checkIfEmailExists(email);
        if (emailExists instanceof Error) throw emailExists;
        if (emailExists) {
            return getFailureResponse(ValidationFailureTypes.EMAIL_EXIST);
        }

        const hashedPassword = await hash(password as string, 10);
        const createResult = await DBService.createCredentialUser(email, hashedPassword);
        if (createResult instanceof Error) throw createResult;

        const userId = createResult._id.toString() as string;

        return NextResponse.json({ result: "success", userId })
    }

    catch (error) {
        console.error("An error occurred: " + error);
        return new NextResponse(undefined, { status: 500 });
    }
}

