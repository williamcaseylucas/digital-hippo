import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const { user } = await getServerSideUser(cookies);

  // If the user tries to access these two pages while they are logged in
  if (user && ["/sign-in", "sign-up"].includes(nextUrl.pathname))
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);

  return NextResponse.next(); // just do next action
}
