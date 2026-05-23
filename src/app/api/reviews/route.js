import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const getDatabase = async () => {
  if (!clientPromise) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "doctor_manager");
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const userEmail = searchParams.get("userEmail");

    const db = await getDatabase();
    const reviewsCollection = db.collection("reviews");

    let query = {};
    if (doctorId) {
      query.doctorId = doctorId;
    } else if (userEmail) {
      query.userEmail = userEmail;
    } else {
      return NextResponse.json(
        { message: "Either doctorId or userEmail is required." },
        { status: 400 }
      );
    }

    const reviews = await reviewsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      reviews: reviews.map((review) => ({
        ...review,
        _id: review._id.toString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to load reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userEmail,
      userName,
      userPhoto,
      doctorId,
      doctorName,
      rating,
      comment,
    } = body;

    const requiredFields = [
      "userEmail",
      "doctorId",
      "doctorName",
      "rating",
      "comment",
    ];

    const missingField = requiredFields.find((field) => body[field] === undefined || body[field] === null || body[field] === "");
    if (missingField) {
      return NextResponse.json(
        { message: `${missingField} is required.` },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // 1. Verify that the user has booked at least one appointment with this doctor
    const appointmentsCollection = db.collection("appointments");
    const appointment = await appointmentsCollection.findOne({
      userEmail: userEmail,
      doctorId: doctorId,
    });

    if (!appointment) {
      return NextResponse.json(
        {
          message:
            "Permission denied. You can only review a doctor after booking an appointment with them.",
        },
        { status: 403 }
      );
    }

    // 2. Save the review
    const reviewsCollection = db.collection("reviews");
    const result = await reviewsCollection.insertOne({
      userEmail,
      userName: userName || "Anonymous Patient",
      userPhoto: userPhoto || "",
      doctorId,
      doctorName,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    });

    // 3. Optional: we can update the average rating and patients count in the future,
    // but since we read live from the reviews collection on the details page, it will be dynamically computed!

    return NextResponse.json(
      {
        message: "Review added successfully!",
        insertedId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to add review." },
      { status: 500 }
    );
  }
}
