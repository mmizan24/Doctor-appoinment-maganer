import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const editableFields = [
  "patientName",
  "gender",
  "phone",
  "appointmentDate",
  "appointmentTime",
];

const getAppointmentsCollection = async () => {
  if (!clientPromise) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const client = await clientPromise;
  const database = client.db(process.env.MONGODB_DB || "doctor_manager");

  return database.collection("appointments");
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { message: "userEmail is required." },
        { status: 400 },
      );
    }

    const collection = await getAppointmentsCollection();
    const appointments = await collection
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      appointments: appointments.map((appointment) => ({
        ...appointment,
        _id: appointment._id.toString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to load appointments." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
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

    const collection = await getAppointmentsCollection();

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

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const updates = await request.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "A valid appointment id is required." },
        { status: 400 },
      );
    }

    if (!updates.userEmail) {
      return NextResponse.json(
        { message: "userEmail is required." },
        { status: 400 },
      );
    }

    const updatePayload = editableFields.reduce((payload, field) => {
      if (updates[field] !== undefined) {
        payload[field] = updates[field];
      }

      return payload;
    }, {});

    const collection = await getAppointmentsCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userEmail: updates.userEmail },
      { $set: { ...updatePayload, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Appointment updated successfully!",
      appointment: { ...result, _id: result._id.toString() },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update appointment." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userEmail = searchParams.get("userEmail");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "A valid appointment id is required." },
        { status: 400 },
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { message: "userEmail is required." },
        { status: 400 },
      );
    }

    const collection = await getAppointmentsCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userEmail,
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Appointment deleted successfully!",
      deletedId: id,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete appointment." },
      { status: 500 },
    );
  }
}
