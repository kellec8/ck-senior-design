import { useEffect, useRef, useState } from "react";

type Germ = {
  id: number;
  word: string;
  left: number;
  top: number;
  visible: boolean;
  killed: boolean;
};

type GameProps = {
    onWin: () => void;
    onLose: () => void;
    volume: number;
    lives: number;
}

const words = [
    "apple", "bread", "cheese", "milk", "butter", "egg", "bacon", "steak", 
    "chicken", "salad", "soup", "pasta", "rice", "pizza", "burger", "donut", 
    "cookie", "cake", "carrot", "onion", "garlic", "pepper", "salt", "sugar", 
    "honey", "jam", "ketchup", "mustard", "mayo", "pickle", "sausage", "noodle", 
    "shrimp", "fish", "beans", "corn", "lettuce", "tomato", "potato", "gravy",
    "spoon", "fork", "knife", "plate", "bowl", "cup", "pan", "pot", "skillet", 
    "ladle", "whisk", "spatula", "tongs", "grater", "peeler", "colander", 
    "strainer", "tray", "cuttingboard", "rollingpin", "measuringcup", 
    "measuringspoon", "timer", "oven", "stove", "microwave", "blender", 
    "toaster", "fridge", "freezer", "kettle", "thermometer",
    "casserole", "marinade", "ingredient", "recipe", "utensil", "cookware", 
    "seasoning", "dishwasher", "refrigerator", "temperature"
];

export default function FloorGame({onWin, onLose, volume, lives}: GameProps) {
    const [germs, setGerms] = useState<Germ[]>([]);
    const [input, setInput] = useState("");
    const [timeLimit, setTimeLimit] = useState(20);
    const [timeSpent, setTimeSpent] = useState(0);

    const splatAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        splatAudio.current = new Audio("/Floorgame/splat.m4a");
        splatAudio.current.volume = volume / 100;
        splatAudio.current.preload = "auto";
    }, [])

    useEffect(() => {
    const timer = setInterval(() => {
        setTimeSpent(timeSpent => timeSpent + .01);
    }, 10);

    return () => clearInterval(timer);
    }, []);

    const timeSpentRef = useRef(timeSpent);

    useEffect(() => {
        timeSpentRef.current = timeSpent; // update ref whenever timeSpent changes
    }, [timeSpent]);

    const lost = () =>  {return false};


    useEffect(() => {
        if (lost()) {
        const id = setTimeout(() => onLose(), 0);
        return () => clearTimeout(id);
        }
    }, [lost, onLose]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeSpentRef.current >= timeLimit) {  // check latest time
                clearInterval(interval);
                return;
            }

            const side = Math.floor(Math.random() * 4);
            const newGerm: Germ = {
                word: words[Math.floor(Math.random() * words.length)],
                id: Math.random(),
                left: side === 0 ? 0 : side === 1 ? 100 : Math.random() * 100,
                top: side === 2 ? 0 : side === 3 ? 100 : Math.random() * 100,
                visible: true,
                killed: false,
            };
            setGerms(prev => [...prev, newGerm]);
        }, 1750);

        return () => clearInterval(interval);
    }, []);  // run only once

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setGerms(prev =>
            prev.map(g => g.visible && !g.killed ? { ...g, top: g.top - 45 < 1 ? g.top + 0.5 : g.top - 0.5, left: g.left - 45 < 1 ? g.left + 0.5 : g.left - 0.5} : g)
            );
        }, 50);

        return () => clearInterval(moveInterval);
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    setGerms(prev =>
        prev.map(g => 
        g.visible && !g.killed && g.word === e.target.value
            ? { ...g, killed: true, visible: false }
            : g
        )
    );

    if (germs.some(g => g.word === e.target.value)) {
        splatAudio.current?.play();
        setInput("");
    }
    };

    if(germs.some(g => g.left > 44 && g.left < 46 && g.top < 46 && g.top > 44)) {
        onLose();
    }

    useEffect(() => {
    if (germs.length > 0 && germs.every(g => g.killed) && timeSpent >= timeLimit) {
        onWin();
    }
    }, [germs, onWin]);

    return (
    <div>
        <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
        {(5 > timeSpent) && <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"50vh", zIndex:10000, WebkitTextStroke:"2px black", textAlign:"center"}}>Protect the food!</h1>}
        {germs.map((g, index) => 
        g.visible && (
            <div key={index} style={{ position: "absolute", display: "inline-block", left:`${g.left}vw`, top:`${g.top}vh`, zIndex:10 }}>
            <img src="Floorgame/Roach.png" style={{ width: "10vw", height: "10vw" }} />

            <span
                style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textShadow: "1px 1px 2px black",
                pointerEvents: "none",
                }}
            >
                {g.word}
            </span>
            </div>
        )
        )}

        <input 
        type="text" 
        value={input} 
        placeholder="TYPE HERE TO EXTERMINATE"
        onChange={handleInput} 
        style={{position: "fixed", width:"20vw", left: "50w", top:"50vh", backgroundColor:"darkgray", zIndex:10, border:"1px solid black", color:"black", textAlign:"center"}}
        />
        <img src="Floorgame/Cake.png" style={{position: "fixed", left:"30vw", top:"30vh", width:"40vw", height:"40vh"}}></img>

        <progress style={{position: "fixed", bottom: 0, zIndex: 2, width:"100vw", height:"2.5vh"}} value={timeLimit-timeSpent} max={timeLimit}></progress>
        </div>
        <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"2.5vh", zIndex:2}}>{Math.round(Math.max(timeLimit-timeSpent, 0))}</h1>
        { lives > 0 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img>}
        { lives > 1 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img>}
        { lives > 2 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img>}
  
    </div>
    )
}