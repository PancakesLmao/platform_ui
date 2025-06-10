"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState("");

  const handleLogin = async () => {
    try {
      // Debug information
      const host = window.location.host;
      
      // Better subdomain detection
      let isSubdomain = false;
      let mainDomain = "";
      
      if (host.includes("localhost")) {
        // Local development - check for pattern like login.localhost:3000
        isSubdomain = host.includes(".localhost");
        mainDomain = host.includes(".localhost") ? 
          host.replace(/^[^.]+\./, "") : host;
      } else {
        // Production environment
        const parts = host.split(".");
        isSubdomain = parts.length > 2;
        mainDomain = parts.length > 2 ? 
          parts.slice(1).join(".") : host;
      }
      
      setDebugInfo(`Host: ${host}, Is Subdomain: ${isSubdomain}, Main Domain: ${mainDomain}`);

      // TODO: Add your authentication logic here

      // Force a small delay to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isSubdomain) {
        // If we're on a subdomain, redirect to main domain's dashboard
        console.log(`Redirecting to ${window.location.protocol}//${mainDomain}/dashboard`);
        window.location.href = `${window.location.protocol}//${mainDomain}/dashboard`;
      } else {
        // If already on main domain, just navigate
        console.log("Navigating to /dashboard using router");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error instanceof Error) {
        setDebugInfo(`Error: ${error.message}`);
      } else {
        setDebugInfo(`Error: ${String(error)}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Login Page</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleLogin}
      >
        Login
      </button>
      {debugInfo && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p>Debug info:</p>
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  );
}