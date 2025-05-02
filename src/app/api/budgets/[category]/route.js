import connectDB from "@/lib/mongodb";
import Budget from "@/models/Budget";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    // Access params directly (no await needed)
    const category = decodeURIComponent(params.category);

    if (!category || !/^[\w\s-]+$/i.test(category)) {
      return NextResponse.json(
        { error: "Invalid category format" },
        { status: 400 }
      );
    }

    const { amount } = await request.json();

    await connectDB();

    const budget = await Budget.findOneAndUpdate(
      { category },
      { amount },
      { upsert: true, new: true }
    );

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
