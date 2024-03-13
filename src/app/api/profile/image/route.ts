import { options } from "@/app/api/auth/[...nextauth]/options";
import { invalidRequestResponse, invalidUserResponse, unauthorizedResponse } from "@/app/api/utils";
import { DBService } from "@/db_service/db_service";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const imageData = await request.formData();
        const image = imageData.get("image");
        const userId = imageData.get("userId");

        if (!userId || !(image instanceof File)) return invalidRequestResponse();

        const session = await getServerSession(options);
        if (!session || userId !== session?.user.id) return unauthorizedResponse();

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await DBService.handleProfileImageChanging(userId, buffer, image.type);
        if (result instanceof Error) throw result;
        if (!result) return invalidUserResponse();

        //result is profileImage's URL
        return NextResponse.json(
            { result: "success", imageURL: result as string },
            {
                headers: { "Content-Type": "application/json" },
                status: 200
            });

    } catch {
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 })
    }

}
