'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"

export default function options() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Options
      </h1>
      <button type="button" onClick={() => router.push('/options')} className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Audio
      </button>
      <button type="button" onClick={() => router.push('/')} className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Back
      </button>
    </div>
  );
}
