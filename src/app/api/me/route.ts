import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Pornpailin Jaowatthanaphong",
    studentId: "660610777",
  });
};
