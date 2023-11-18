import React, { useState, useEffect } from "react"

// import goat from "./images/goat.png"

export default function App() {
    const hexCount = 11

    const [hex, setHex] = useState(
        Array.from(Array(hexCount**2)).map((_, i) => {
            const c =  i % hexCount
            const r = Math.floor(i / hexCount)
            return {
                c,
                r,
                id: i,
                cellNum: convergeNum([c, r], hexCount),
                active: true,
            }
        })
    )

    const [player, setPlayer] = useState({
        x: Math.floor(hexCount/2),
        y: Math.floor(hexCount/2),
        top: 0,
        left: 0,
        gt: 0,
        gl: 0,
        dir: 0,
        transition: 'all .2s ease',
    })

    const [pass, setPass] = useState(0)
    const [isWin, setIsWin] = useState(false)
    
    // const hexToDecimal = (hex) => parseInt(hex, 16)
    // const decToHex = (dec) => Math.abs(dec).toString(16)
    const random = (n) => Math.floor(Math.random() * n)

    const red = getComputedStyle(document.documentElement)
        .getPropertyValue('--red')

    const green = getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary-color')

    useEffect(() => {
        if (pass) {
            passTurn()
        }
    }, [pass])

    useEffect(() => {
        const {dir, cellNum, x, y} = player
        if (cellNum === 0 && !isWin) {
            setTimeout(() => {
                const cExtreme = Math.round(((x / (hexCount-1)) - .5)*1.1)
                const rExtreme = Math.round(((y / (hexCount-1)) - .5)*1.1)
                const distance = 90
                const time = 2
                setPlayer(prevPlayer => {
                    return {
                        ...prevPlayer,
                        top: prevPlayer.top + rExtreme * distance * time,
                        left: prevPlayer.left + cExtreme * distance * time,
                        transition: `all ${time}s ease`,
                    }
                })
                setIsWin(true)
            }, 200)
        }
        
    }, [player])

    const hexElements = hex.map((h) => {
        const {c, r, id, cellNum, active} = h
        const {isWalking} = player
        const style =  {
            left: r % 2 ? 'calc(28px * var(--scale))' : null,
        }
        // const maxCellNum = Math.max(...hex.map(h => h.cellNum))
        // const percentage = (100*cellNum)/maxCellNum
        // const color = getBetweenColor([red, green], percentage/100)
        const color = active ? green : red
        const isCentral = Math.floor(hexCount/2) === c && Math.floor(hexCount/2) === r

        return (
            <div 
                key={h.id}
                className="hex"
                data-column={c} 
                data-row={r}
                data-id={id}
                data-cell-num={cellNum}
                style={style}                
                onClick={() => {
                    if (!active) return
                    if (isWin) return
                    deactivateHex(h.id)
                    setPass(prevPass => prevPass + 1)
                }}
                onKeyUp={(e) => {
                    if (e.code !== 'Enter' && e.code !== 'Space') return
                    if (!active) return
                    if (isWin) return
                    deactivateHex(h.id)
                    setPass(prevPass => prevPass + 1)
                }}
                tabIndex='1'
            >
                <div className="hex-top" style={{
                    borderBottom: `calc(15px * var(--scale)) solid ${color}`
                }}></div>
                <div className="hex-middle" style={{
                    backgroundColor: `${color}`
                }}>
                    {/* <span>{cellNum}</span>
                    <span>{id}</span> */}
                    {isCentral && (
                        <div className="goat-wrapper" style={{
                            transform: `translate(-50%, -75%) scaleX(${player.dir % 2 ? '' : '-'}1)`,
                            top: `calc(50% + (${player.top}px * var(--scale)) + (${player.gt} * 4px))`,
                            left: `calc(50% + (${player.left}px * var(--scale)) + (${player.gl} * 4px))`,
                            transition: player.transition,
                        }}>
                            <div className="shadow"></div>
                            <div 
                                onAnimationEnd={(e) => setPlayer(prevPlayer => ({...prevPlayer, isWalking: false}))} 
                                className={`goat ${isWin || isWalking ? 'walking' : ''}`}
                                style={{
                                    animationIterationCount: isWin ? 'infinite' : '1',
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="hex-bottom" style={{
                    borderTop: `calc(15px * var(--scale)) solid ${color}`
                }}></div>
            </div>
        )

    })

    function passTurn() {
        const {x, y} = player
        const id = (y * hexCount) + x
        const minHex = getAroundHex({x, y, id})
        const {c, r} = minHex
        const {top, left, gt, gl} = walkGoat(minHex.dir)
        setPlayer(prevPlayer => {
            return (
                {
                    ...prevPlayer,
                    x: c,
                    y: r,
                    top: prevPlayer.top + top,
                    left: prevPlayer.left + left,
                    gt: prevPlayer.gt + gt,
                    gl: prevPlayer.gl + gl,
                    dir: minHex.dir,
                    cellNum: minHex.cellNum,
                    isWalking: true,
                }
            )
        })
    }

    function walkGoat(d) {
        const indexUD = Math.floor(d/2)-1
        const indexLR = Math.sign(d % 2 - .5)

        const top = 45 * indexUD
        const gt = indexUD
        const left  = (52 - (Math.abs(indexUD) * 26)) * indexLR
        const gl = (1 - (Math.abs(indexUD) * .5)) * indexLR

        return {top, left, gt, gl}
    }

    function getAroundHex(i) {
        const {x, y, id} = i
        const ol = y % 2 ? 0 : 1
        const around = [hex[id-hexCount-ol], hex[id-hexCount+1-ol], hex[id-1], hex[id+1], hex[id+hexCount-ol], hex[id+hexCount+1-ol]].map((h, i) => ({...h, dir: i}))
        const aroundActive = around.filter(h => h.active)
        const minValue = Math.min(...aroundActive.map(h => h.cellNum))
        const aroundFilter = aroundActive.filter(h => h.cellNum === minValue)
        return aroundFilter[random(aroundFilter.length)]
    }

    function deactivateHex(id) {
        setHex(prevHex => {
            return prevHex.map(h => {
                return h.id === id ? (
                    {...h, active: false}
                ) : h
            })
        })
    }

    function convergeNum(numbers, range) {
        range = range - 1
        const numbersDistance = numbers.map(n => distance(n, range))
        return Math.min(...numbersDistance)
        
        function distance(n, range) {
            const distanceToEnd = range - n
            const min = Math.min(distanceToEnd, n)
            return min
        }
    }

    return (
        <>
            <main className="main-game">
                <div className="table"style={{
                    gridTemplateColumns: `repeat(${hexCount}, 1fr)`,
                }}
                >
                    {hexElements}
                </div>
            </main>
        </>       
    )
}