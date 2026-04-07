import { CSSProperties, useEffect, useRef, useState } from "react";
import Hearts from "../components/Hearts";


type GameProps = {
    onWin: () => void;
    onLose: () => void;
    volume: number;
    lives: number;
}

type Food = {
    name: string;
    src: string;
    pos: number;
    index: number;
}

type Phase = "intro" | "revealing" | "hidden" | "recall";

const foodStyle = (pos: number, index: number, row: number): CSSProperties => ({
    position: "absolute",
    top: row == 0 ? "20vh" : row == 1 ? "40vh" : "60vh",
    left: `${pos}vw`,
    zIndex: 500 - index,
    cursor: "pointer",
    width: "20vh",
    height: "20vh",
    objectFit: "contain",
})

export default function GroceryListGame({onWin, onLose, volume, lives}: GameProps) {
    const [phase, setPhase] = useState<Phase>("intro");
    const [fullList, setFullList] = useState<Food[]>([]);
    const [visibleCount, setVisibleCount] = useState(0);
    const [playerAnswers, setPlayerAnswers] = useState<string[]>([]);
    const [timeSpent, setTimeSpent] = useState(0);
    const [timeLimit, setTimeLimit] = useState(20);

    const handleClick = (food: Food) => {
        scribbleAudio.current?.play();
        setPlayerAnswers(p => [...p, food.name])
    }

    const scribbleAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        scribbleAudio.current = new Audio("/GroceryList/scribble.m4a");
        scribbleAudio.current.volume = volume / 100;
        scribbleAudio.current.preload = "auto";
    }, [])

    const lost = () =>  {return timeLimit < timeSpent};
    useEffect(() => {
        if (lost()) {
        const id = setTimeout(() => onLose(), 0);
        return () => clearTimeout(id);
        }
    }, [lost, onLose]);

    useEffect(() => {
        setTimeout(() => {
            setPhase("revealing")
        }, 5000)
    }, [])

    const allFoods = [
        { name: "KFC", src: "FRIDGE/FOOD/Untitled.png", pos: 10, index: 0 },
        { name: "Grilled Cheese", src: "FRIDGE/FOOD/GrilledCheese.png", pos: 30, index: 0 },
        { name: "Fruit", src: "FRIDGE/FOOD/Fruit.png", pos: 50, index: 0 },
        { name: "Donut", src: "FRIDGE/FOOD/Donut.png", pos: 70, index: 0 },
        { name: "Burger", src: "FRIDGE/FOOD/Burger.png", pos: 10, index: 0 },
        { name: "Cheese", src: "FRIDGE/FOOD/Cheese.png", pos: 30, index: 0 },
        { name: "Ketchup", src: "FRIDGE/FOOD/Ketchup.png", pos: 50, index: 0 },
        { name: "Mustard", src: "FRIDGE/FOOD/Mustard.png", pos: 70, index: 0 },
        { name: "Milk", src: "FRIDGE/FOOD/Milk.png", pos: 10, index: 0},
        { name: "Butter", src: "FRIDGE/FOOD/Butter.png", pos: 30, index: 0 },
        { name: "Salad", src: "FRIDGE/FOOD/Salad.png", pos: 50, index: 0 },
        { name: "Soup", src: "SOUP/topleft.png", pos: 70, index: 0 },
    ]

    useEffect(() => {
    const list = [...allFoods]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    setFullList(list);
    }, []);

    useEffect(() => {
        if (phase !== "revealing") return;

        if (visibleCount < fullList.length) {
            const timeout = setTimeout(() => {
            scribbleAudio.current?.play();
            setVisibleCount(prev => prev + 1);
            }, 1000);

            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
            setPhase("hidden");
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [visibleCount, phase, fullList]);

    useEffect(() => {
        if (phase !== "hidden") return;

        const timeout = setTimeout(() => {
            setPhase("recall");
        }, 1500);

        return () => clearTimeout(timeout);
    }, [phase]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent(timeSpent => timeSpent + .01);
        }, 10);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
    if (phase === "recall") {
        const correctSoFar = playerAnswers.every(
            (item, index) => item === fullList[index].name
        );

        if (!correctSoFar) {
            onLose();
        }

        if (playerAnswers.length === fullList.length && correctSoFar) {
        onWin();
        }
    }
    }, [playerAnswers, phase, fullList, onWin, onLose]);

    return (
    <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
    {phase === "intro" && <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"50vh", textAlign:"center", WebkitTextStroke:"2px black"}}>Remember the grocery list!</h1>}
    
    {phase === "revealing" && (
    <div style={{backgroundColor:"#f5edd6", padding:"100px"}}>
        <h1 style={{color:"black", fontSize:"2rem"}}>GROCERY LIST</h1>
        {fullList.slice(0, visibleCount).map(item => (
        <h1 key={item.name} style={{color:"black", fontSize:"2rem"}}>{item.name}</h1>
        ))}
    </div>
    )}
    {phase === "recall" && (
    allFoods.map((food, index) =>
        <img key={food.name} src={food.src} style={foodStyle(food.pos, index, Math.floor(index / 4))} onClick={() => handleClick(food)}></img>
    )
    )}

    <progress style={{position: "fixed", bottom: 0, zIndex: 2, width:"100vw", height:"2.5vh"}} value={timeLimit-timeSpent} max={timeLimit}></progress>
    <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"0", zIndex:2, left:"2.5vw"}}>{Math.round(Math.max(timeLimit-timeSpent, 0))}</h1>
    <Hearts lives={lives}></Hearts>
    </div>
    )

}