import { connectMongoDB } from "@/lib/mongodb";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectMongoDB();
    const tickets = await Contact.find();
    return NextResponse.json({ tickets });
  } catch (error) {
    console.log(error);
    return NextResponse.error("Error fetching tickets!", 500);
  }
}
export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json();
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ message: "Ticket deleted successfully!" });
  } catch (error) {
    console.log(error);
    return NextResponse.error("Error deleting ticket!", 500);
  }
}
export async function PATCH(req) {
  try {
    await connectMongoDB();
    const { id, status, response } = await req.json();
    const updateFields = {};
    if (status) updateFields.status = status;
    if (response) updateFields.response = response;
    await Contact.findByIdAndUpdate(id, updateFields);
    return NextResponse.json({
      message: "Ticket updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.error("Error updating ticket!", 500);
  }
}
