import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

export const app = isFirebaseConfigured
  ? !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const discordProvider = new OAuthProvider("discord.com");
discordProvider.addScope("identify");
discordProvider.addScope("email");

export async function loginWithDiscord(): Promise<User | null> {
  if (!auth) {
    throw new Error("Firebase Auth is not configured. Please set your environment variables.");
  }
  const result = await signInWithPopup(auth, discordProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export interface VoteRecord {
  userId: string;
  userName: string;
  userAvatar: string;
  categoryId: number;
  categoryTitle: string;
  staffName: string;
  votedAt?: any;
}

export async function saveVoteToFirestore(vote: VoteRecord): Promise<void> {
  if (!db) {
    console.warn("Firestore is not configured. Saving vote locally.");
    return;
  }

  // Document ID: userId_categoryId ensures 1 vote per user per category
  const voteDocRef = doc(db, "votes", `${vote.userId}_${vote.categoryId}`);
  await setDoc(voteDocRef, {
    ...vote,
    votedAt: serverTimestamp(),
  });
}

export function subscribeToUserVotes(
  userId: string,
  onUpdate: (votes: Record<number, string>) => void
) {
  if (!db) return () => {};

  const votesRef = collection(db, "votes");
  const q = query(votesRef, where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const votes: Record<number, string> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (typeof data.categoryId === "number" && data.staffName) {
          votes[data.categoryId] = data.staffName;
        }
      });
      onUpdate(votes);
    },
    (err) => {
      console.error("Error subscribing to user votes:", err);
    }
  );
}

export { onAuthStateChanged };
export type { User };
