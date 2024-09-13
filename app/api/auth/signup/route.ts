// pages/api/auth/signup.ts
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import prismadb from '@/lib/prismadb';
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  console.log("[SIGNUP_CREDENTIAL]")
  const body = await req.json();
  const { email, password, name } = body;
  if (!email || !password) {
    return new NextResponse('Email and password are required', { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await prismadb.userSettings.findFirst({
      where: {
        email,
        password: {
          not: null,
        },
      },
    });

    if (existingUser) {
      return new NextResponse('User already exists with this email', { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique userId
    const userId = "user_" + uuidv4();

    // Create new user
    const newUser = await prismadb.userSettings.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        name,
      },
    });

    await prismadb.chatSetting.create({
      data: {
        userId,
        voiceId: "",
        themeId: "",
        prompt: "",
        chat_model: "gpt-4o"
      }
    });
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}