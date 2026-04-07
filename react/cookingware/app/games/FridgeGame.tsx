'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import { relative } from "path";
import { Children, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import EndScreen from "../components/EndScreen"
import { CSSProperties } from "react";

type GameProps = {
    onWin: () => void;
    onLose: () => void;
    volume: number;
    lives: number;
}

type FoodType = {
    name: string;
    src: string;
    pos: number;
    index: number;
}

const foodStyle = (pos: number, index: number, row: number): CSSProperties => ({
    position: "absolute",
    top: row == 0 ? "10vh" : row == 1 ? "25vh" : "40vh",
    left: `${pos}vw`,
    zIndex: 500 - index,
    cursor: "pointer",
    width: "150px",
    height: "150px",
    objectFit: "contain",
})

export default function FridgeGame({onWin, onLose, volume, lives}: GameProps) {
    const foods = [
        { name: "KFC", src: "FRIDGE/FOOD/Untitled.png", pos: 0, index: 0 },
        { name: "Grilled Cheese", src: "FRIDGE/FOOD/GrilledCheese.png", pos: 0, index: 0 },
        { name: "Fruit", src: "FRIDGE/FOOD/Fruit.png", pos: 0, index: 0 },
        { name: "Donut", src: "FRIDGE/FOOD/Donut.png", pos: 0, index: 0 },
        { name: "Burger", src: "FRIDGE/FOOD/Burger.png", pos: 0, index: 0 },
        { name: "Cheese", src: "FRIDGE/FOOD/Cheese.png", pos: 0, index: 0 },
        { name: "Ketchup", src: "FRIDGE/FOOD/Ketchup.png", pos: 0, index: 0 },
        { name: "Mustard", src: "FRIDGE/FOOD/Mustard.png", pos: 0, index: 0 },
        { name: "Milk", src: "FRIDGE/FOOD/Milk.png", pos: 0, index: 0},
        { name: "Butter", src: "FRIDGE/FOOD/Butter.png", pos: 0, index: 0 },
        { name: "Salad", src: "FRIDGE/FOOD/Salad.png", pos: 0, index: 0 },
        { name: "Soup", src: "SOUP/topleft.png", pos: 0, index: 0 },

    ]

    const [foodArray, setFoodArray] = useState(shuffleArray(foods));
    const [timeSpent, setTimeSpent] = useState(0)
    const [timeLimit, setTimeLimit] = useState(10);
    const [goalFood, setGoalFood] = useState(foodArray?.at(-1));

    const [foodStack, setFoodStack] = useState(shuffleArray(
    [foods.map(food => ({
        ...food,
        pos: Math.random() * 20 + 35,
        index: Math.trunc(Math.random() * 100 + 20),
    })),
    foods.filter(food => food.name !== goalFood?.name).map(food => ({
        ...food,
        pos: Math.random() * 20 + 35,
        index: Math.trunc(Math.random() * 100 + 20),
    })), 
    foods.filter(food => food.name !== goalFood?.name).map(food => ({
        ...food,
        pos: Math.random() * 20 + 35,
        index: Math.trunc(Math.random() * 100 + 20),
    }))]));

    function shuffleArray<T>(array: T[]): T[] {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const lost = () =>  {return timeLimit < timeSpent};

    const fridgeStyle: CSSProperties = {
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
        fridgeAudio.current = new Audio("/FRIDGE/rummage.m4a");
        fridgeAudio.current.volume = volume / 100;
        fridgeAudio.current.preload = "auto";
    }, [])

    useEffect(() => {
        if (lost()) {
        const id = setTimeout(() => onLose(), 0);
        return () => clearTimeout(id);
        }
    }, [lost, onLose]);

    const handleClick = (clickedFood: FoodType, index: number) => {

        if (fridgeAudio.current) {
            fridgeAudio.current.play();
        }

        if (clickedFood.name === goalFood?.name)
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
            
            {(1 > timeSpent) && goalFood && <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"50vh", zIndex:10000, WebkitTextStroke:"2px black"}}>Find the {goalFood.name}</h1>}

            {foodStack[0].map((food, index) => (
                <img
                    src={food.src}
                    key={food.name}
                    onClick={() => handleClick(food, 0)}
                    style={foodStyle(food.pos, food.index, 0)}
                />
            ))}

            {foodStack[1].map((food, index) => (
                <img
                    src={food.src}
                    key={food.name}
                    onClick={() => handleClick(food, 1)}
                    style={foodStyle(food.pos, food.index, 1)}                />
            ))}

            {foodStack[2].map((food, index) => (
                <img
                    src={food.src}
                    key={food.name}
                    onClick={() => handleClick(food, 2)}
                    style={foodStyle(food.pos, food.index, 2)}
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