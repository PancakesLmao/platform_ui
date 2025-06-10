"use client"

import { useRouter } from "next/navigation"

export default function Home() {
    const router = useRouter()
    
    const handleLogin = async () => {
        TODO:
        router.push("/dashboard")
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Login Page</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  )
}
