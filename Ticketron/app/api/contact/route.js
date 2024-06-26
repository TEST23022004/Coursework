import { connectMongoDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
export async function POST(req) {
  const { fullname, email, title, category, message, status, response } =
    await req.json();
  try {
    await connectMongoDB();
    await Contact.create({
      fullname,
      email,
      title,
      category,
      message,
      status,
      response,
    });
    return NextResponse.json({
      msg: ["Ticket created successfully!"],
      success: true,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ msg: errorList });
    } else {
      return NextResponse.json({ msg: ["Unable to create ticket!"] });
    }
  }
}
