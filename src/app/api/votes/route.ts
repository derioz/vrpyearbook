import { NextResponse } from "next/server";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "staffyearbook";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, userAvatar, categoryId, categoryTitle, staffName } = body;

    if (!userId || categoryId === undefined || !staffName) {
      return NextResponse.json({ error: "Missing required vote parameters" }, { status: 400 });
    }

    const docId = `${userId}_${categoryId}`;
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/votes/${encodeURIComponent(
      docId,
    )}`;

    const firestorePayload = {
      fields: {
        userId: { stringValue: String(userId) },
        userName: { stringValue: String(userName || "Anonymous") },
        userAvatar: { stringValue: String(userAvatar || "") },
        categoryId: { integerValue: String(categoryId) },
        categoryTitle: { stringValue: String(categoryTitle || "") },
        staffName: { stringValue: String(staffName) },
        votedAt: { timestampValue: new Date().toISOString() },
      },
    };

    const res = await fetch(firestoreUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(firestorePayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firestore REST Write Error:", errText);
      return NextResponse.json(
        { error: `Firestore write failed: ${errText}`, savedLocally: true },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      message: `Vote for ${staffName} successfully saved to Firebase Firestore!`,
      docId,
      data,
    });
  } catch (error: any) {
    console.error("Vote API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/votes?pageSize=300`;

    const res = await fetch(firestoreUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ votes: {} });
    }

    const data = await res.json();
    const documents = data.documents || [];

    const userVotes: Record<number, string> = {};
    const allVotes: Array<{ categoryId: number; staffName: string; userId: string }> = [];

    documents.forEach((doc: any) => {
      const fields = doc.fields || {};
      const docUserId = fields.userId?.stringValue;
      const catId = fields.categoryId?.integerValue
        ? parseInt(fields.categoryId.integerValue, 10)
        : undefined;
      const staff = fields.staffName?.stringValue;

      if (catId !== undefined && staff) {
        allVotes.push({ categoryId: catId, staffName: staff, userId: docUserId });
        if (userId && docUserId === userId) {
          userVotes[catId] = staff;
        }
      }
    });

    return NextResponse.json({
      userVotes,
      totalVotesCount: allVotes.length,
      allVotes,
    });
  } catch (error: any) {
    console.error("Fetch Votes Error:", error);
    return NextResponse.json({ userVotes: {} });
  }
}
