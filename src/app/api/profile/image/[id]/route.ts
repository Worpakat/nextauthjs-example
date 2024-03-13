import { DBService } from "@/db_service/db_service";
import { NextRequest, NextResponse } from "next/server";

/**Gets images from DB and serves them. */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const imageDocument = await DBService.getProfileImageDocument(params.id);
        if (imageDocument instanceof Error) throw imageDocument;
        if (!imageDocument) return NextResponse.json({ result: "failure", message: "Image not found." }, { status: 404 });

        const mimeType = imageDocument.mimeType;
        const data = Buffer.from(imageDocument.imageData, 'base64');

        const response = new NextResponse(data);
        response.headers.set('Content-Type', mimeType);
        return response;

    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: "failure", message: "A server error occurred." }, { status: 500 })
    }
}


