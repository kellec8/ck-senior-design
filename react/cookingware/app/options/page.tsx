'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import { Slider } from '@mui/material/'
import * as React from 'react'

export default function options() {
  const router = useRouter()
  const [value, setValue] = React.useState<number>(50);

  const handleChange = (event: Event, newValue: number) => {
    setValue(newValue);
  }

  return (
    <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Options
      </h1>
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Audio: {value}%
      </h1>
      <Slider value={value} onChange={handleChange} style={{width:'30rem'}}/>
      <button type="button" onClick={() => router.push('/options/credits')} className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Credits
      </button>
      <button type="button" onClick={() => router.push('/')} className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50" style={{cursor:'pointer'}}>
        Back
      </button>
    </div>
  );
}
