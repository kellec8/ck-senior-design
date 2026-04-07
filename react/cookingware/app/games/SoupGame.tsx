'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import { relative } from "path";
import { Children, CSSProperties, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import EndScreen from "../components/EndScreen"

type GameProps = {
    onWin: () => void;
    onLose: () => void;
    volume: number;
    lives: number;
}

export default function SoupGame({onWin, onLose, volume, lives}: GameProps) {
    const [timeSpent, setTimeSpent] = useState(0)
    const [hover, setHover] = useState("topright")
    const prevHoverRef = useRef("");
    const [progress, setProgress] = useState(0);

    const [goal, setGoal] = useState(40);
    const [timeLimit, setTimeLimit] = useState(10);

    const lost = () =>  {return timeLimit < timeSpent};


    const goalRef = useRef(goal);


    const stirAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        stirAudio.current = new Audio("/SOUP/stirnoise.m4a");
        stirAudio.current.volume = volume / 100;
        stirAudio.current.preload = "auto";
    }, [])

    const soupStyle: CSSProperties = {
        height: '90vh',
        width: '90vw',
        objectFit: "contain",
        zIndex: 1,
        overflow: "hidden",
    }

    const quarterScreen = {
        width: '50vw',
        height: '50vh',
        zIndex: 3
    }

    const router = useRouter()

    useEffect(() => {
    const timer = setInterval(() => {
        setTimeSpent(timeSpent => timeSpent + .01);
    }, 10);

    return () => clearInterval(timer);
    }, []);


    useEffect(() => {
    if (progress >= goal) {
        const id = setTimeout(() => onWin(), 0);
        return () => clearTimeout(id);
    }
    }, [progress, goal, onWin]);

    useEffect(() => {
        if (lost()) {
        const id = setTimeout(() => onLose(), 0);
        return () => clearTimeout(id);
        }
    }, [lost, onLose]);


    useEffect(() => {
        goalRef.current = goal;
    }, [goal]);

    useEffect(() => {
        if (hover) {
            switch(prevHoverRef.current) {
                case "topleft":
                    if(hover == "topright") {
                        setProgress(p => p + 1);
                    }
                break;
                case "topright":
                    if(hover == "bottomright") {
                        setProgress(p => p + 1);
                    }
                break;
                case "bottomright":
                    if(hover == "bottomleft") {
                        setProgress(p => p + 1);
                    }
                break;
                case "bottomleft":
                    if(hover == "topleft") {
                        setProgress(p => p + 1);
                    }
                break;
            }
        }
        prevHoverRef.current = hover;
    }, [hover])

    function handleHoverChange(direction: string) {
        setHover(direction)
        if(stirAudio)
            stirAudio.current?.play();
    }

    return (
    <div>
        <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
                {(1 > timeSpent) && <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"50vh", zIndex:10000, textAlign:"center", WebkitTextStroke:"2px black"}}>Stir the soup clockwise!</h1>}
        <img src={"SOUP\\" + hover + ".png"} style={soupStyle}></img>
        <div style={{...quarterScreen, position: "fixed", top: 0, left: 0, zIndex:100}} onMouseEnter={() => {handleHoverChange("topleft")}}></div>
        <div style={{...quarterScreen, position: "fixed", top: 0, right: 0, zIndex:100}} onMouseEnter={() => handleHoverChange("topright")}></div>
        <div style={{...quarterScreen, position: "fixed",  bottom: 0, right: 0, zIndex:100}} onMouseEnter={() => handleHoverChange("bottomright")}></div>
        <div style={{...quarterScreen, position: "fixed",  bottom: 0, left: 0, zIndex:100}} onMouseEnter={() => handleHoverChange("bottomleft")}></div>
        <progress style={{position: "fixed", bottom: 0, zIndex: 2, width:"100vw", height:"2.5vh"}} value={timeLimit-timeSpent} max={timeLimit}></progress>
        </div>
        <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"2.5vh", zIndex:2}}>{Math.round(timeLimit - timeSpent)}</h1>
        { lives > 0 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img>}
        { lives > 1 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img>}
        { lives > 2 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img>}
    </div>
    )

}
