import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transactions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const txns = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(txns);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const txn = await Transaction.create(data);
    return NextResponse.json(txn, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
