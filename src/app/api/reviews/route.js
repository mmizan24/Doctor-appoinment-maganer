import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const serializeReview = (review) => ({
  ...review,
  _id: review._id.toString(),
});

export async function GET(request) {
  try {
    const doctorId = request.nextUrl.searchParams.get("doctorId");
    const filter = doctorId ? { doctorId } : {};

    const db = await getDb();
    const reviews = await db
      .collection("reviews")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({ reviews: reviews.map(serializeReview) });
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return Response.json({ message: "Failed to load reviews." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.userEmail || !body.doctorId || !body.doctorName || !body.comment) {
      return Response.json(
        { message: "User, doctor, rating, and comment are required." },
        { status: 400 },
      );
    }

    const rating = Math.min(5, Math.max(1, Number(body.rating) || 1));
    const comment = String(body.comment).trim();
    const now = new Date();
    const review = {
      appointmentId: body.appointmentId || "",
      userEmail: body.userEmail,
      userName: body.userName || body.userEmail.split("@")[0] || "Anonymous Patient",
      userPhoto: body.userPhoto || "",
      doctorId: body.doctorId,
      doctorName: body.doctorName,
      rating,
      comment,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const result = await db.collection("reviews").insertOne(review);

    return Response.json(
      {
        message: "Review submitted successfully.",
        review: serializeReview({ ...review, _id: result.insertedId }),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to submit review:", error);
    return Response.json({ message: "Failed to submit review." }, { status: 500 });
  }
}
