import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function getUserIdFromToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// GET Notes
export async function GET(req) {
  await connectDB();

  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notes = await Note.find({ userId });
  return NextResponse.json(notes);
}

// POST Note
export async function POST(req) {
  await connectDB();

  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();

  const note = await Note.create({
    userId,
    title,
    content,
  });

  return NextResponse.json(note);
}