import { getCartSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        const sessionId = await getCartSession();
        console.log("Guest Session ID (SessionAPI): ", sessionId);
        return NextResponse.json({sessionId});
    } catch (error) {
        return NextResponse.json(
            {error: "Failed ot initiaze session"},
            {status: 500}
        );
    }
}