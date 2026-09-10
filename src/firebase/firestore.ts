import { getFirestore } from "firebase/firestore";
import { app } from "./config";

/**
 * Firestore database instance
 */
export const db = getFirestore(app);

export default db;