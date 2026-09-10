import * as http from "http";
import { exec } from "child_process";

export function startAuthServer(firebaseConfig: any): Promise<{
  idToken: string;
  uid: string;
  email: string;
  displayName: string;
}> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Firebase Auth for Seeder</title>
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    const firebaseConfig = ${JSON.stringify(firebaseConfig)};

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    document.getElementById("loginBtn").addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const googleIdToken = credential.idToken;
        
        await fetch("/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: googleIdToken,
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          })
        });
        
        document.body.innerHTML = "<div style='text-align: center; margin-top: 50px;'><h1>Authentication successful!</h1><p>You can close this tab and return to the terminal.</p></div>";
      } catch (err) {
        alert("Auth failed: " + err.message);
      }
    });
  </script>
</head>
<body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; color: #0f172a; margin: 0;">
  <div style="background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; max-width: 400px; width: 90%;">
    <h2 style="margin-bottom: 10px;">Community Hero</h2>
    <p style="color: #64748b; margin-bottom: 30px; font-size: 14px;">Sign in with Google to authorize the seeder script.</p>
    <button id="loginBtn" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background-color: #0f172a; color: #ffffff; border: none; border-radius: 12px; font-weight: 600; transition: background-color 0.2s;">Sign in with Google</button>
  </div>
</body>
</html>
        `);
      } else if (req.method === "POST" && req.url === "/token") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const data = JSON.parse(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
          
          server.close(() => {
            console.log("Local auth server closed.");
            resolve({
              idToken: data.token,
              uid: data.uid,
              email: data.email,
              displayName: data.displayName,
            });
          });
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });

    server.listen(3080, "localhost", () => {
      console.log("\n==================================================");
      console.log("Authentication Required");
      console.log("Please open http://localhost:3080 in your browser to sign in with Google.");
      console.log("==================================================\n");
      
      // Automatically open browser on Windows
      exec("start http://localhost:3080");
    });
  });
}
