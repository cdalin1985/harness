import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Config validation — fails fast and clearly if env vars are missing
// ---------------------------------------------------------------------------
function getRequiredEnv(key: string): string {
  const val = import.meta.env[key] as string | undefined;
  if (!val) {
    throw new Error(
      `[HarnessOS] Missing required environment variable: ${key}. ` +
      `Copy .env.example to .env and fill in all Firebase credentials.`
    );
  }
  return val;
}

const firebaseConfig = {
  apiKey:            getRequiredEnv('VITE_FIREBASE_API_KEY'),
  authDomain:        getRequiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId:         getRequiredEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket:     getRequiredEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId:             getRequiredEnv('VITE_FIREBASE_APP_ID'),
};

// databaseId has a safe default — Firestore works without a named database
const databaseId: string =
  (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string | undefined) ?? '(default)';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null | undefined;
    email?: string | null | undefined;
    emailVerified?: boolean | null | undefined;
    isAnonymous?: boolean | null | undefined;
    tenantId?: string | null | undefined;
    providerInfo?: {
      providerId?: string | null | undefined;
      email?: string | null | undefined;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) ?? []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Auto-create user document if it doesn't exist
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? 'Developer',
        photoURL: user.photoURL ?? '',
        role: 'user',
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Login failed", error);
  }
}

export async function logout() {
  await signOut(auth);
}
