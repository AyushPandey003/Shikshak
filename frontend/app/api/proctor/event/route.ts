import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, duration, timestamp } = body;

        // Log the event (In a real app, this would save to a database)
        console.log(`[PROCTOR EVENT] Type: ${type}, Duration: ${duration}ms, Timestamp: ${timestamp}`);

        if (type === "EYE_CLOSED_TOO_LONG") {
            // Logic to flag the user in DB
            console.warn("User flagged for suspicious activity (sleeping/eyes closed)");
        }

        return NextResponse.json({ ok: true, message: "Event logged" });
    } catch (error) {
        console.error("Error processing proctor event:", error);
        return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}
