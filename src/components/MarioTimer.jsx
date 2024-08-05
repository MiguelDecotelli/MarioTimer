import { useState, useEffect, useRef } from "react";
import title from "./../assets/imgs/itsAMeMario.png"
import marioJumping from "./../assets/imgs/marioJump.png"
import mario from "./../assets/imgs/mario.png"
import play from "./../assets/imgs/play.png"
import stop from "./../assets/imgs/stop.png"
import restart from "./../assets/imgs/restart.png"

import './MarioTimer.css'

function MarioTimer() {
    const [time, setTime] = useState({ minutes: 0, seconds: 0 });
    const [isActive, setIsActive] = useState(false);
    const [initialMinutes, setMinutes] = useState(0);
    const [initialSeconds, setSeconds] = useState(0);
    const [isJumping, setIsJumping] = useState(false);

    const marioSong = useRef(new Audio(process.env.PUBLIC_URL + '/SuperMarioBros.mp3'));
    const itsAMeMario = useRef(new Audio(process.env.PUBLIC_URL + '/itsamemario.mp3'));
    const levelComplete = useRef(new Audio(process.env.PUBLIC_URL + '/levelComplete.mp3'));
    const marioJumpSound = useRef(new Audio(process.env.PUBLIC_URL + '/marioJumpSound.mp3'));


    marioSong.current.loop = true;

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    const newSeconds = prevTime.seconds - 1;
                    if (newSeconds < 0) {
                        if (prevTime.minutes > 0) {
                            return { minutes: prevTime.minutes - 1, seconds: 59 };
                        } else {
                            clearInterval(interval);
                            setIsActive(false);
                            marioSong.current.pause()
                            levelComplete.current.play();
                            return { ...prevTime, seconds: 0 };
                        }
                    } else {
                        return { ...prevTime, seconds: newSeconds };
                    }
                });
            }, 1000);
            marioSong.current.play();

        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval)
        }
    }, [isActive]);

    const handleStart = () => {
        if (!isActive) {
            if (time.minutes === 0 && time.seconds === 0) {
                setTime({ minutes: initialMinutes, seconds: initialSeconds })
            }
            setIsActive(true)
            marioSong.current.play();
        }
    }

    const handleStop = () => {
        setIsActive(false)
        marioSong.current.pause();
        itsAMeMario.current.play();
    }

    const handleReset = () => {
        setTime({ minutes: initialMinutes, seconds: initialSeconds });
        setIsActive(false)
        marioSong.current.pause()
        marioSong.currentTime = 0;
    }

    const handleJump = () => {
        setIsJumping(true);
        marioJumpSound.current.play();
        setTimeout(() => {
            setIsJumping(false);
        }, 100)
    }

    const handleMinutesChange = (event) => {
        setMinutes(parseInt(event.target.value, 10));
    };

    const handleSecondsChange = (event) => {
        setSeconds(parseInt(event.target.value, 10));
    };

    return (
        <>
            <div>
                <header>
                    <div>
                        <img src={title} alt="title" srcset="" />
                    </div>
                </header>
                <main>
                    <section>
                        <div className="input-container">
                            <input type="number" value={initialMinutes} onChange={handleMinutesChange} placeholder="Min" />
                            <input type="number" value={initialSeconds} onChange={handleSecondsChange} placeholder="Sec" />
                        </div>
                        <div>
                            <h1>{time.minutes}:{time.seconds < 10 ? `0${time.seconds}` : time.seconds}</h1>
                        </div>
                        <div>
                            <button onClick={handleStart}><img id="start" src={play} alt="play" srcset="" /></button>
                            <button onClick={handleStop}><img id="stop" src={stop} alt="stop" srcset="" /></button>
                            <button onClick={handleReset}><img id="restart" src={restart} alt="restart" srcset="" /></button>
                        </div>
                    </section>
                    <section id="marioImage">
                        <img
                            src={marioJumping}
                            alt="jumping"
                            onClick={handleJump}
                            className={isJumping ? 'mario-jumping' : ''}
                        />
                    </section>
                </main>
            </div>
        </>
    );
}

export default MarioTimer