import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const serializeAppointment = (appointment) => ({
  ...appointment,
  _id: appointment._id.toString(),
});

const getAppointmentId = async (params) => {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
};

const getAuthUser = async (request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session?.user || null;
};

export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser(request);

    if (!user?.email) {
      return Response.json({ message: "Authentication is required." }, { status: 401 });
    }

    const appointmentId = await getAppointmentId(params);

    if (!appointmentId) {
      return Response.json({ message: "Invalid appointment id." }, { status: 400 });
    }

    const body = await request.json();

    const update = {
      patientName: body.patientName,
      gender: body.gender,
      phone: body.phone,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      updatedAt: new Date(),
    };

    const db = await getDb();
    const result = await db.collection("appointments").findOneAndUpdate(
      { _id: appointmentId, userEmail: user.email },
      { $set: update },
      { returnDocument: "after" },
    );

    if (!result) {
      return Response.json({ message: "Appointment not found." }, { status: 404 });
    }

    return Response.json({
      message: "Appointment updated successfully.",
      appointment: serializeAppointment(result),
    });
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return Response.json({ message: "Failed to update appointment." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);

    if (!user?.email) {
      return Response.json({ message: "Authentication is required." }, { status: 401 });
    }

    const appointmentId = await getAppointmentId(params);

    if (!appointmentId) {
      return Response.json({ message: "Invalid appointment id." }, { status: 400 });
    }
    const db = await getDb();
    const result = await db
      .collection("appointments")
      .deleteOne({ _id: appointmentId, userEmail: user.email });

    if (!result.deletedCount) {
      return Response.json({ message: "Appointment not found." }, { status: 404 });
    }

    return Response.json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    return Response.json({ message: "Failed to delete appointment." }, { status: 500 });
  }
}
