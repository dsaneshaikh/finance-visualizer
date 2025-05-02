import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transactions";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const updates = await req.json();
    const updated = await Transaction.findByIdAndUpdate(params.id, updates, {
      new: true,
    });
    return updated
      ? NextResponse.json(updated)
      : NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const deleted = await Transaction.findByIdAndDelete(params.id);
    return deleted
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
