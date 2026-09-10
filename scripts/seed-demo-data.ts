import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local manually to ensure correct config initialization
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([^#\s=]+)\s*=\s*(.*)$/);
      if (match) {
        let key = match[1];
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    }
  }
}

interface LocationArea {
  name: string;
  lat: number;
  lng: number;
}

const areas: LocationArea[] = [
  { name: "Tonk Phatak", lat: 26.883, lng: 75.801 },
  { name: "Malviya Nagar", lat: 26.853, lng: 75.819 },
  { name: "Mansarovar", lat: 26.854, lng: 75.756 },
  { name: "Vaishali Nagar", lat: 26.902, lng: 75.748 },
  { name: "Raja Park", lat: 26.897, lng: 75.830 },
  { name: "Bapu Nagar", lat: 26.889, lng: 75.808 },
  { name: "Civil Lines", lat: 26.909, lng: 75.788 },
  { name: "Jagatpura", lat: 26.828, lng: 75.864 }
];

const categories = ["Roads", "Garbage", "Water", "Traffic", "Street Lights", "Safety"];
const statuses = ["Pending", "Assigned", "In Progress", "Resolved"];

const categoryData: Record<string, {
  descriptions: string[];
  summaries: string[];
  departments: string[];
}> = {
  "Roads": {
    descriptions: [
      "Large pothole in the middle of the street, causing cars to swerve dangerously.",
      "Cracked asphalt and uneven road surface near the main road intersection.",
      "Road surface is peeling off, exposing deep gravel and creating heavy dust.",
      "Severe road erosion due to recent rain, making it difficult to drive."
    ],
    summaries: [
      "Pothole repair needed on major avenue.",
      "Asphalt damage reported near intersection.",
      "Road surface erosion reported.",
      "Dangerous pothole causing traffic swerving."
    ],
    departments: ["Public Works Department", "Municipal Corporation (Roads)"]
  },
  "Garbage": {
    descriptions: [
      "Overflowing public dustbin with trash scattered all over the pavement.",
      "Illegal dumping of construction waste on the side of the road.",
      "Household waste piled up near the park entrance, attracting stray animals.",
      "Large pile of plastic bottles and cardboard boxes blocking the footpath."
    ],
    summaries: [
      "Garbage collection and clean-up required.",
      "Illegal dumping removal needed.",
      "Waste accumulation at park entrance.",
      "Blocked footpath due to piles of trash."
    ],
    departments: ["Sanitation Department", "Municipal Corporation (Solid Waste)"]
  },
  "Water": {
    descriptions: [
      "Water leaking from an underground pipe, flooding the street.",
      "Low water pressure reported in the residential pipeline.",
      "Drinking water supply has a brown tint and smells metallic.",
      "Sewage water backflowing from a manhole, creating a foul odor."
    ],
    summaries: [
      "Underground pipe leak causing flooding.",
      "Water quality issue reported in neighborhood.",
      "Low water pressure in main pipeline.",
      "Sewage backup and bad odor."
    ],
    departments: ["Water Supply and Sewage Board", "Jal Department"]
  },
  "Traffic": {
    descriptions: [
      "Traffic lights at the crossroad are completely blacked out, causing chaos.",
      "Incorrect timing on the traffic signal, leading to long traffic jams.",
      "Traffic sign has fallen down and is blocking the bicycle lane.",
      "Heavy congestion due to illegal parking in front of the commercial complex."
    ],
    summaries: [
      "Traffic signal malfunction reported.",
      "Signage repair required.",
      "Incorrect traffic light timing.",
      "Illegal parking causing heavy traffic."
    ],
    departments: ["Traffic Police Division", "Road Safety Department"]
  },
  "Street Lights": {
    descriptions: [
      "Entire row of street lights is off, making the street pitch black at night.",
      "Street light is flickering constantly, creating a disturbance.",
      "Broken street light bulb due to vandalism.",
      "Street light pole is bent dangerously after an accident."
    ],
    summaries: [
      "Street light maintenance required.",
      "Flickering street light replacement.",
      "Broken street light bulb replacement.",
      "Bent street light pole hazard."
    ],
    departments: ["Electricity Department", "Municipal Corporation (Electrical)"]
  },
  "Safety": {
    descriptions: [
      "Broken guardrail on the flyover, posing a risk of vehicles falling off.",
      "Open manhole on the pedestrian walkway, dangerous for children.",
      "Stray dogs pack behaving aggressively near the primary school.",
      "Fallen tree branch hanging low over the electrical lines."
    ],
    summaries: [
      "Pedestrian hazard due to open manhole.",
      "Public safety risk reported.",
      "Broken flyover guardrail hazard.",
      "Aggressive stray dogs near school."
    ],
    departments: ["Municipal Corporation (Public Safety)", "Disaster Management Cell"]
  }
};

function generateStatusHistory(status: string, createdAt: Date) {
  const history = [];
  const baseTime = createdAt.getTime();

  history.push({
    status: "Pending",
    description: "Report submitted by citizen.",
    timestamp: new Date(baseTime)
  });

  if (status === "Pending") return history;

  const assignTime = baseTime + 1000 * 60 * 60 * 2; // 2 hours later
  history.push({
    status: "Assigned",
    description: "Assigned to the corresponding municipal department.",
    timestamp: new Date(assignTime)
  });

  if (status === "Assigned") return history;

  const progressTime = assignTime + 1000 * 60 * 60 * 24; // 1 day later
  history.push({
    status: "In Progress",
    description: "Inspection completed, field work started.",
    timestamp: new Date(progressTime)
  });

  if (status === "In Progress") return history;

  const resolveTime = progressTime + 1000 * 60 * 60 * 48; // 2 days later
  history.push({
    status: "Resolved",
    description: "Issue resolved successfully. Verified by field team.",
    timestamp: new Date(resolveTime)
  });

  return history;
}

async function main() {
  loadEnv();

  // Initialize Firebase locally in the script to ensure same module instance
  const { initializeApp } = await import("firebase/app");
  const { getFirestore, collection, addDoc, getDocs, deleteDoc, query, where } = await import("firebase/firestore");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const { startAuthServer } = await import("./auth-helper");
  const authData = await startAuthServer(firebaseConfig);

  console.log("Authenticating as seeder user...");
  const { getAuth, GoogleAuthProvider, signInWithCredential } = await import("firebase/auth");
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const credential = GoogleAuthProvider.credential(authData.idToken);
  const userCred = await signInWithCredential(auth, credential);
  const userUid = userCred.user.uid;
  const userDisplayName = userCred.user.displayName || "Demo User";
  const userEmail = userCred.user.email || "demo@example.com";
  console.log(`Logged in successfully as seeder: ${userDisplayName} (${userUid})`);

  console.log("Removing previously generated demo reports...");
  const deleteQuery = query(collection(db, "reports"), where("isDemo", "==", true));
  const deleteSnapshot = await getDocs(deleteQuery);
  console.log(`Found ${deleteSnapshot.size} existing demo reports. Deleting...`);

  for (const docSnap of deleteSnapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
  console.log("Deletion of previous demo reports complete.");

  const reportPayloads: any[] = [];
  const now = new Date();

  // 1. Generate guaranteed combinations (6 categories x 4 statuses = 24 reports)
  for (const cat of categories) {
    for (const stat of statuses) {
      const area = areas[Math.floor(Math.random() * areas.length)];
      const lat = area.lat + (Math.random() - 0.5) * 0.008;
      const lng = area.lng + (Math.random() - 0.5) * 0.008;

      const catInfo = categoryData[cat];
      const desc = catInfo.descriptions[Math.floor(Math.random() * catInfo.descriptions.length)];
      const summary = catInfo.summaries[Math.floor(Math.random() * catInfo.summaries.length)];
      const dept = catInfo.departments[Math.floor(Math.random() * catInfo.departments.length)];

      const score = Math.floor(Math.random() * 60) + 40; // range 40-100
      const confidence = Math.floor(Math.random() * 30) + 70; // range 70-100
      const severity = score >= 80 ? "High" : score >= 50 ? "Medium" : "Low";

      const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000);
      const history = generateStatusHistory(stat, createdAt);

      reportPayloads.push({
        uid: userUid,
        displayName: userDisplayName,
        email: userEmail,
        isDemo: true,
        category: cat,
        status: stat,
        description: desc,
        mediaType: "image",
        mimeType: "image/jpeg",
        createdAt,
        updatedAt: history[history.length - 1].timestamp,
        statusHistory: history,
        location: {
          latitude: lat,
          longitude: lng,
          address: `Plot No. ${Math.floor(Math.random() * 450) + 1}, Near ${area.name}, Jaipur`,
          city: "Jaipur",
          state: "Rajasthan",
          country: "India",
          accuracy: 10
        },
        aiAnalysis: {
          category: cat,
          severity,
          priorityScore: score,
          department: dept,
          summary,
          confidence
        }
      });
    }
  }

  // 2. Generate random extra reports to reach total of 45 (21 additional reports)
  for (let i = 0; i < 21; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const stat = statuses[Math.floor(Math.random() * statuses.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const lat = area.lat + (Math.random() - 0.5) * 0.008;
    const lng = area.lng + (Math.random() - 0.5) * 0.008;

    const catInfo = categoryData[cat];
    const desc = catInfo.descriptions[Math.floor(Math.random() * catInfo.descriptions.length)];
    const summary = catInfo.summaries[Math.floor(Math.random() * catInfo.summaries.length)];
    const dept = catInfo.departments[Math.floor(Math.random() * catInfo.departments.length)];

    const score = Math.floor(Math.random() * 60) + 40;
    const confidence = Math.floor(Math.random() * 30) + 70;
    const severity = score >= 80 ? "High" : score >= 50 ? "Medium" : "Low";

    const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000);
    const history = generateStatusHistory(stat, createdAt);

    reportPayloads.push({
      uid: userUid,
      displayName: userDisplayName,
      email: userEmail,
      isDemo: true,
      category: cat,
      status: stat,
      description: desc,
      mediaType: "image",
      mimeType: "image/jpeg",
      createdAt,
      updatedAt: history[history.length - 1].timestamp,
      statusHistory: history,
      location: {
        latitude: lat,
        longitude: lng,
        address: `Plot No. ${Math.floor(Math.random() * 450) + 1}, Near ${area.name}, Jaipur`,
        city: "Jaipur",
        state: "Rajasthan",
        country: "India",
        accuracy: 10
      },
      aiAnalysis: {
        category: cat,
        severity,
        priorityScore: score,
        department: dept,
        summary,
        confidence
      }
    });
  }

  console.log(`Writing ${reportPayloads.length} demo reports to Firestore...`);
  const reportsCol = collection(db, "reports");
  for (const report of reportPayloads) {
    await addDoc(reportsCol, report);
  }
  console.log("Seeding complete.");

  // Automatic Validation
  console.log("\nRunning automatic filter combination validation...");
  const validationQuery = query(collection(db, "reports"), where("isDemo", "==", true));
  const validationSnapshot = await getDocs(validationQuery);
  const validationReports = validationSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  } as any));

  let validationFailed = false;

  for (const cat of categories) {
    for (const stat of statuses) {
      const matchReports = validationReports.filter(
        (r) => r.category === cat && r.status === stat
      );

      const validCoordsReports = matchReports.filter(
        (r) => typeof r.location?.latitude === "number" && typeof r.location?.longitude === "number"
      );

      if (validCoordsReports.length === 0) {
        validationFailed = true;
        console.error(`\n[VALIDATION FAIL] Combination Category: "${cat}", Status: "${stat}" returns 0 reports.`);
        
        if (matchReports.length === 0) {
          console.log(`- Reason: missing test data (0 matching reports in Firestore).`);
        } else {
          console.log(`- Reason: missing coordinates (${matchReports.length} matching reports, but 0 contain valid latitude/longitude numbers).`);
        }

        // Print sample values from Firestore
        console.log("Sample Reports currently in database:");
        validationReports.slice(0, 5).forEach((r) => {
          console.log(
            `  * ID: ${r.id}, Category: "${r.category}", Status: "${r.status}", HasCoords: ${!!(r.location?.latitude && r.location?.longitude)}`
          );
        });
      }
    }
  }

  if (!validationFailed) {
    console.log("\n[VALIDATION SUCCESS] All 24 category and status combinations return at least one valid coordinate report!");
  } else {
    console.log("\n[VALIDATION COMPLETE] Validation found some failing combinations as logged above.");
  }
}

main().catch((err) => {
  console.error("Critical error in seeder script:", err);
  process.exit(1);
});
