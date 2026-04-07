import { CSSProperties, useEffect, useRef, useState } from "react";

type GameProps = {
    onWin: () => void;
    onLose: () => void;
    volume: number;
    lives: number;
}

type popcorn = {
    popped: boolean;
    left: number;
    top: number;
    visible: boolean;
    rotation: number;
}

const foodStyle = (popcorn: popcorn): CSSProperties => ({
    position: "absolute",
    top: `${popcorn.top}vh`,
    left: `${popcorn.left}vw`,
    cursor: "pointer",
    width: "10vh",
    height: "10vh",
    objectFit: "contain",
    transform: `rotate(${popcorn.rotation}deg)`,
    zIndex: 10
})

const popcornLimit = 10;

export default function PopcornGame({onWin, onLose, volume, lives}: GameProps) {
    const [timeSpent, setTimeSpent] = useState(0);
    const [timeLimit, setTimeLimit] = useState(10);
    const [popcornArray, setPopcornArray] = useState<popcorn[]>(() => 
        Array.from({ length: popcornLimit }, () => ({
            popped: false,
            left: Math.random() * 80 + 10,
            top: Math.random() * 80 + 10,
            visible: false,
            rotation: Math.random() * 360,
        }))    
    );
    const [visibleAmount, setVisibileAmount] = useState(0);
    const [popped, setPopped] = useState(0);

    const popAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        popAudio.current = new Audio("/POPCORN/pop.m4a");
        popAudio.current.volume = volume / 100;
        popAudio.current.preload = "auto";
    }, [])

    useEffect(() => {
    const timer = setInterval(() => {
        setTimeSpent(timeSpent => timeSpent + .01);
    }, 10);

    return () => clearInterval(timer);
    }, []);

    const lost = () =>  {return timeLimit < timeSpent};

    const won = () => {return popped === popcornLimit}

    useEffect(() => {
        if (lost()) {
        const id = setTimeout(() => onLose(), 0);
        return () => clearTimeout(id);
        }
    }, [lost, onLose]);

    useEffect(() => {
        if(visibleAmount < popcornArray.length) {
            const interval = setInterval(() => {
                setPopcornArray(prev => {
                    const newArray = [...prev];
                    newArray[visibleAmount].visible = true;
                    return newArray;
                })

            setVisibileAmount(prev => prev + 1);
            }, 500);

            return () => clearInterval(interval);
        }
    }, [visibleAmount, popcornArray.length]);

    const handleClick = (popcorn: popcorn, index: number) => {
        if(!popcorn.popped) {
        if (popAudio.current) {
            const clone = popAudio.current.cloneNode(true) as HTMLAudioElement;
            clone.play();
        }

        setPopcornArray(prev => {
            const newArray = [...prev];
            newArray[index] = { ...newArray[index], popped: true, visible: true };
            return newArray;
        });

        setPopped(prev => prev + 1);
        if (popped === popcornLimit - 1) onWin();

        setTimeout(() => {
            setPopcornArray(prev => {
                const newArray = [...prev];
                newArray[index] = { ...newArray[index], visible: false };
                return newArray;
            });
        }, 300);
        }
    }

    return (
        <div>
            <div className="flex min-h-screen center items-center justify-center bg-zinc-50 font-sans dark:bg-black" style={{flexDirection: "column"}}>
            {(1 > timeSpent) && <h1 style={{color:"white", fontSize:"10rem", position:"absolute", bottom:"50vh", zIndex:10000, WebkitTextStroke:"2px black"}}>Pop the Corn!</h1>}

            {popcornArray.map((popcorn, index) =>
                popcorn.visible && (<img src={popcorn.popped ? "POPCORN/Popcorn.png" : "POPCORN/Kernel.png"} key={index} onClick={() => handleClick(popcorn, index)} style={foodStyle(popcorn)}></img>
            ))}
            <progress style={{position: "fixed", bottom: 0, zIndex: 2, width:"100vw", height:"2.5vh"}} value={timeLimit-timeSpent} max={timeLimit}></progress>

            { lives > 0 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:0, imageRendering:"pixelated"}}></img>}
            { lives > 1 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"10vh", imageRendering:"pixelated"}}></img>}
            { lives > 2 ? <img src="full_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img> : <img src="empty_heart.png" style={{position:"fixed", zIndex: 2, height:"10vh", width:"10vh", bottom:"2.5vh", right:"20vh", imageRendering:"pixelated"}}></img>}
            </div>
        </div>
    )
}