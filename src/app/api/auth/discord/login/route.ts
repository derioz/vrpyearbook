import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const host = request.headers.get("host") || "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1529991232292520036";
  const redirectUri = `${baseUrl}/api/auth/discord/callback`;

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&response_type=code&scope=identify`;

  return NextResponse.redirect(discordAuthUrl);
}
