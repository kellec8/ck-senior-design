'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"

export default function game() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
      This is the game
    </div>
  );
}
