import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: body.username,
      password: body.password,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const data = await res.json();

  return NextResponse.json({
    token: data.token,
    role: "admin",  //به دلیل محدودیت دامی جیسون مجبور به در نظر گرفتن رول ثابت هستم
  });
}
