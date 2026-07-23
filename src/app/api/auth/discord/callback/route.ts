import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const host = request.headers.get("host") || "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/discord/callback`;

  if (!code) {
    return new NextResponse("Authorization code missing", { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1529991232292520036";
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || "RDbvzvXeaKESFC8GGsJZM3zNmSnWCclS";

  try {
    // Exchange auth code for access token
    const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Discord Token Exchange Error:", errorText);
      return new NextResponse(`Token exchange failed: ${errorText}`, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from Discord API
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return new NextResponse("Failed to fetch Discord user profile", { status: 400 });
    }

    const discordUser = await userResponse.json();

    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(discordUser.id) % BigInt(5))}.png`;

    const userPayload = {
      uid: `discord_${discordUser.id}`,
      displayName: discordUser.global_name || discordUser.username,
      username: discordUser.username,
      photoURL: avatarUrl,
      discordId: discordUser.id,
    };

    // Return html that sends message to window.opener or redirects home
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Discord Auth Success</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f0f11; color: #fff; display: grid; place-items: center; height: 100vh; margin: 0; }
            .card { background: #1a1917; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #333; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>✓ Connected as ${userPayload.displayName}</h2>
            <p>Closing window and returning to yearbook...</p>
          </div>
          <script>
            const userObj = ${JSON.stringify(userPayload)};
            try {
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage({ type: "DISCORD_AUTH_SUCCESS", user: userObj }, "*");
                window.close();
              } else {
                localStorage.setItem("vrp_discord_user", JSON.stringify(userObj));
                window.location.href = "/";
              }
            } catch (e) {
              localStorage.setItem("vrp_discord_user", JSON.stringify(userObj));
              window.location.href = "/";
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    console.error("Discord Auth Handler Error:", error);
    return new NextResponse(`Authentication Error: ${error.message}`, { status: 500 });
  }
}
