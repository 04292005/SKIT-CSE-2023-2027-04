import {
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence,
  } from "firebase/auth";
  
  import { app } from "./config";
  
  /**
   * Firebase Authentication instance
   */
  export const auth = getAuth(app);
  
  /**
   * Google Sign-In Provider
   */
  export const googleProvider = new GoogleAuthProvider();
  
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
  
  // Persist login across browser refreshes
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Failed to set auth persistence:", error);
  });
  
  export default auth;