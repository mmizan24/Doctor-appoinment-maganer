import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Robust connection helper for serverless/Next.js environment
async function connectDB() {
  // If already connected, reuse the active instance
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing inside .env.local");
  }

  // Force target your exact database name: 'doctor-manager'
  return mongoose.connect(process.env.MONGODB_URI, {
    dbName: "doctor_manager",
  });
}

// Blueprint matching your exact MongoDB collection structure
const doctorSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Custom string tracking ("d1", "d2")
    name: String,
    specialty: String,
    image: String,
    rating: Number,
    experience: String,
    availability: Array,
    description: String,
    hospital: String,
    location: String,
    fee: Number,
    patients: String,
    education: String,
    languages: Array,
  },
  { 
    // Prevents Mongoose from breaking or trying to cast string IDs into ObjectIds
    id: false, 
    versionKey: false 
  }
);

// Prevent Next.js HMR compilation crashes and lock directly onto the 'doctors' collection
const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema, "doctors");

export async function GET() {
  try {
    // 1. Establish connection to doctor-manager
    await connectDB();
    
    // 2. Fetch records as clean, lightweight JSON objects directly
    const liveDoctors = await Doctor.find({}).lean();
    
    // 3. Fallback check if collection comes up empty
    if (!liveDoctors || liveDoctors.length === 0) {
      console.log("MongoDB status: Connected, but 'doctors' collection is completely empty.");
      return NextResponse.json([]);
    }
    
    // 4. Transform MongoDB's '_id' key back to 'id' so your UI page.jsx maps successfully
    const formattedDoctors = liveDoctors.map((doc) => ({
      ...doc,
      id: doc._id, 
    }));

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error("Database connection/query breakdown:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors data", details: error.message }, 
      { status: 500 }
    );
  }
}