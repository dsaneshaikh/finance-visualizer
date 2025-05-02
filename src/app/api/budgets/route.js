import connectDB from "@/lib/mongodb";
import Budget from "@/models/Budget";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const allBudgets = await Budget.find({});
  return NextResponse.json(allBudgets);
}
