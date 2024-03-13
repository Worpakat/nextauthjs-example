import { DBService } from "@/db_service/db_service";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { invalidUserResponse } from "../../utils";
import { options } from "../../auth/[...nextauth]/options";

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(options);
                
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ result: "failure", message: "You are not authorized." }, { status: 403 });
        }

        const banReqData = await request.json();
        if (!banReqData || !banReqData.userId || typeof banReqData.userId !== 'string') { 
            return NextResponse.json({ result: "failure", message: "Bad request data." }, { status: 400 });
        }

        const result = await DBService.banUnbanUser(banReqData.userId);
        if (result instanceof Error) throw result;
        if (!result) return invalidUserResponse(); //User not found.

        return NextResponse.json({ result: "success" }, { status: 200 })

    } catch (error: Error | any) {
        console.log(error);

        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 });
    }
}