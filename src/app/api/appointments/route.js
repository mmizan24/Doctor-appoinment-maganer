import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    if (!clientPromise) {
      return NextResponse.json(
        { message: "Missing MONGODB_URI environment variable." },
        { status: 500 },
      );
    }

    const appointment = await request.json();
    const requiredFields = [
      "userEmail",
      "doctorName",
      "patientName",
      "gender",
      "phone",
      "appointmentDate",
      "appointmentTime",
    ];

    const missingField = requiredFields.find((field) => !appointment[field]);

    if (missingField) {
      return NextResponse.json(
        { message: `${missingField} is required.` },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB || "doctor_manager");
    const collection = database.collection("appointments");

    const result = await collection.insertOne({
      ...appointment,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Appointment booked successfully!",
        insertedId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to book appointment." },
      { status: 500 },
    );
  }
}
