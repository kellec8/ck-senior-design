'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import * as React from 'react'

export default function Home() {
  const router = useRouter()
  const [audioValue, setAudioValue] = React.useState<number>(50);

  return (
    <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        CookingWare
      </h1>
      <button type="button" onClick={() => router.push('/game')} className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Play
      </button>
      <button type="button" onClick={() => router.push('/options')} className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Options
      </button>
    </div>
  );
}
