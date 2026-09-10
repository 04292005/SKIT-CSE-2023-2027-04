import {
    signInWithPopup,
    signOut,
    User,
  } from "firebase/auth";
  
  import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
  } from "firebase/firestore";
  
  import { auth, googleProvider, db } from "@/firebase";
  
  import {
    DEFAULT_HERO_LEVEL,
    DEFAULT_HERO_POINTS,
    DEFAULT_STREAK,
  } from "../constants";
  
  /**
   * Creates a Firestore profile for first-time users.
   */
  async function createUserDocument(user: User) {
    const userRef = doc(db, "users", user.uid);
  
    const snapshot = await getDoc(userRef);
  
    if (snapshot.exists()) return;
  
    await setDoc(userRef, {
      uid: user.uid,

      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",

      role: "citizen",

      heroPoints: DEFAULT_HERO_POINTS,
      heroLevel: DEFAULT_HERO_LEVEL,

      reportsSubmitted: 0,
      reportsVerified: 0,

      streak: DEFAULT_STREAK,
      lastActiveDate: null,

      badges: [],

      preferredLanguage: "en",

      joinedAt: serverTimestamp(),

      lastLogin: serverTimestamp(),
    });
  }
  
  /**
   * Google Sign In
   */
  export async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
  
    await createUserDocument(result.user);
  
    return result.user;
  }
  
  /**
   * Logout
   */
  export async function logout() {
    await signOut(auth);
  }