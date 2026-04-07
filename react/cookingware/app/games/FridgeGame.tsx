'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import { relative } from "path";
import { Children, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import EndScreen from "../components/EndScreen"

type GameProps = {
    onWin: () => void;
    onLose: () => void;
    volume: number;
    lives: number;
}

export default function FridgeGame({onWin, onLose, volume, lives}: GameProps) {
    const foods = [
        { name: "KFC", src: "FRIDGE/FOOD/Untitled.png", pos: 0 },
        { name: "Grilled Cheese", src: "FRIDGE/FOOD/food2.jpg", pos: 0 },
        { name: "Fruit", src: "FRIDGE/FOOD/food3.webp", pos: 0 },
        { name: "Junk Food", src: "FRIDGE/FOOD/food4.jpg", pos: 0 },
    ]

    const [foodArray, setFoodArray] = useState(shuffleArray(foods));
    const [timeSpent, setTimeSpent] = useState(0)
    const [timeLimit, setTimeLimit] = useState(10);
    const [goalFood, setGoalFood] = useState(foodArray?.at(-1));
    const [foodStack, setFoodStack] = useState(shuffleArray(
    [foods.map(food => ({
        ...food,
        pos: Math.random() * 20 + 35,
    })), 
    foods.filter(food => food.name !== goalFood.name).map(food => ({
        ...food,
        pos: Math.random() * 20 + 35,
    })), 
    foods.filter(food => food.name !== goalFood.name).map(food => ({
        ...food,
        pos: Math.random() * 20 + 35,
    }))]));

    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const lost = () =>  {return timeLimit < timeSpent};

    const fridgeStyle = {
        height: '87.5vh',
        width: '100vw',
        top: 0,
        position:"fixed",
        objectFit: "contain",
        zIndex: 1
    }

    const router = useRouter()

    useEffect(() => {
    const timer = setInterval(() => {
        setTimeSpent(timeSpent => timeSpent + .01);
    }, 10);

    return () => clearInterval(timer);
    }, []);

    const fridgeAudio =  useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fridgeAudio.current = new Audio("/SOUP/stirnoise.m4a");
        fridgeAudio.current.volume = volume / 100;
        fridgeAudio.current.preload = "auto";
    }, [])

    useEffect(() => {
        if (lost()) {
        const id = setTimeout(() => onLose(), 0);
        return () => clearTimeout(id);
        }
    }, [lost, onLose]);

    const handleClick = (clickedFood, index) => {
        if (clickedFood.name === goalFood.name)
            onWin();
        else {
            setFoodStack(prev => {
                const newStack = [...prev];

                newStack[index] = newStack[index].filter(
                    food => food !== clickedFood
                );

                return newStack;
            })
        }
    }

    return (
        <div>
            <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
            
            {(timeLimit / 10 > timeSpent) && goalFood && <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"50vh", zIndex:300, WebkitTextStroke:"2px black"}}>Find the {goalFood.name}</h1>}

            {foodStack[0].map((food, index) => (
                <img
                    src={food.src}
                    key={food.name}
                    onClick={() => handleClick(food, 0)}
                    style={{
                        position: "absolute",
                        top: `90px`,
                        left: `${food.pos}vw`,
                        zIndex: 100 - index,
                        cursor: "pointer",
                        width: "150px",
                        height: "150px",
                        objectFit: "contain",
                    }}
                />
            ))}

            {foodStack[1].map((food, index) => (
                <img
                    src={food.src}
                    key={food.name}
                    onClick={() => handleClick(food, 1)}
                    style={{
                        position: "absolute",
                        top: `225px`,
                        left: `${food.pos}vw`,
                        zIndex: 100 - index,
                        cursor: "pointer",
                        width: "150px",
                        height: "150px",
                        objectFit: "contain",
                    }}
                />
            ))}

            {foodStack[2].map((food, index) => (
                <img
                    src={food.src}
                    key={food.name}
                    onClick={() => handleClick(food, 2)}
                    style={{
                        position: "absolute",
                        top: `400px`,
                        left: `${food.pos}vw`,
                        zIndex: 100 - index,
                        cursor: "pointer",
                        width: "150px",
                        height: "150px",
                        objectFit: "contain",
                    }}
                />
            ))}

            <img src="FRIDGE\\empty_fridge.png" style={fridgeStyle}></img>

            <progress style={{position: "fixed", bottom: 0, zIndex: 2, width:"100vw", height:"2.5vh"}} value={timeLimit-timeSpent} max={timeLimit}></progress>

            { lives > 0 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img>}
            { lives > 1 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img>}
            { lives > 2 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img>}
            </div>
        </div>
    )
}