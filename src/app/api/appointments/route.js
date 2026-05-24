import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const requiredBookingFields = [
  "patientName",
  "gender",
  "phone",
  "appointmentDate",
  "appointmentTime",
  "doctorId",
  "doctorName",
];

const serializeAppointment = (appointment) => ({
  ...appointment,
  _id: appointment._id.toString(),
});

const getAuthUser = async (request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session?.user || null;
};

export async function GET(request) {
  try {
    const user = await getAuthUser(request);

    if (!user?.email) {
      return Response.json({ message: "Authentication is required." }, { status: 401 });
    }

    const db = await getDb();
    const appointments = await db
      .collection("appointments")
      .find({ userEmail: user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      appointments: appointments.map(serializeAppointment),
    });
  } catch (error) {
    console.error("Failed to load appointments:", error);
    return Response.json({ message: "Failed to load bookings." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);

    if (!user?.email) {
      return Response.json({ message: "Authentication is required." }, { status: 401 });
    }

    const body = await request.json();
    const missingField = requiredBookingFields.find((field) => !body[field]);

    if (missingField) {
      return Response.json(
        { message: `${missingField} is required.` },
        { status: 400 },
      );
    }

    const now = new Date();
    const appointment = {
      userEmail: user.email,
      patientName: body.patientName,
      gender: body.gender,
      phone: body.phone,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      doctorId: body.doctorId,
      doctorName: body.doctorName,
      specialty: body.specialty || "",
      hospital: body.hospital || "",
      fee: Number(body.fee) || 0,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const result = await db.collection("appointments").insertOne(appointment);

    return Response.json(
      {
        message: "Appointment booked successfully.",
        appointment: serializeAppointment({ ...appointment, _id: result.insertedId }),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to book appointment:", error);
    return Response.json({ message: "Failed to book appointment." }, { status: 500 });
  }
}
