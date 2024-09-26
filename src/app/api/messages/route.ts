import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database, Payload } from "@lib/types";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const roomId = searchParams.get('roomId');

  readDB();
  const foundRoomId = (<Database>DB).messages.find((x) => x.roomId === roomId);

  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const wantedRoomId = (<Database>DB).messages.filter((x) => x.roomId === roomId);
  return NextResponse.json(
    {
      ok: true,
      messages: wantedRoomId,
    }
  )

};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { roomId, messageText } = body;

  readDB();

  const foundRoomId = (<Database>DB).messages.find((x) => x.roomId === roomId);

  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  (<Database>DB).messages.push({
    roomId,
    messageId,
    messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  const { role } = <Payload>payload;

  if (role != "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { messageId } = body;

  readDB();
  const foundIndex = (<Database>DB).messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (foundIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  (<Database>DB).messages.splice(foundIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
