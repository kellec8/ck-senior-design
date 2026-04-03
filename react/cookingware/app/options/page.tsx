'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import { Slider } from '@mui/material/'
import * as React from 'react'
import { useGame } from '../context/GameContext'

export default function options() {
  const router = useRouter()
  const {volume, setVolume} = useGame();

  const handleChange = (event: Event, newValue: number) => {
    setVolume(newValue);
  }

  return (
    <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Options
      </h1>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Audio: {volume}%
      </h1>
      <Slider value={volume} onChange={handleChange} style={{width:'40vw', height:'3px'}}/>
      <button type="button" onClick={() => router.push('/options/credits')} className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Credits
      </button>
      <button type="button" onClick={() => router.push('/')} className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Back
      </button>
    </div>
  );
}
