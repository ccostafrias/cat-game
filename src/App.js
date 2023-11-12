import React, { useState, useEffect } from "react"


export default function App() {
    const hexCount = 9

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
    })

    const [pass, setPass] = useState(0)
    
    const hexToDecimal = (hex) => parseInt(hex, 16)
    const decToHex = (dec) => Math.abs(dec).toString(16)
    const random = (n) => Math.floor(Math.random() * n)

    const red = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')

    const green = getComputedStyle(document.documentElement)
        .getPropertyValue('--secondary-color')

    useEffect(() => {
        if (pass) {
            passTurn()
        }
    }, [pass])

    const hexElements = hex.map((h, i) => {
        const {c, r, id, cellNum, active} = h
        const style =  {
            left: r % 2 ? 'calc(28px * var(--scale))' : null,
            opacity: active ? '1' : '.75',
        }
        const maxCellNum = Math.max(...hex.map(h => h.cellNum))
        const percentage = (100*cellNum)/maxCellNum
        const color = getBetweenColor([red, green], percentage/100)
        // const color = green
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
                    deactivateHex(h.id)
                    setPass(prevPass => prevPass + 1)
                }}
            >
                <div className="hex-top" style={{
                    borderBottom: `calc(15px * var(--scale)) solid ${color}`
                }}></div>
                <div className="hex-middle" style={{
                    backgroundColor: `${color}`
                }}>
                    <span>{cellNum}</span>
                    <span>{id}</span>
                    {isCentral && (
                        <div className="goat" style={{
                            top: `calc(50% + (${player.top}px * var(--scale)) + (${player.gt} * 4px))`,
                            left: `calc(50% + (${player.left}px * var(--scale)) + (${player.gl} * 4px))`,
                        }}>
                            <h1>CABRA</h1>
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
                    x: c,
                    y: r,
                    top: prevPlayer.top + top,
                    left: prevPlayer.left + left,
                    gt: prevPlayer.gt + gt,
                    gl: prevPlayer.gl + gl,
                }
            )
        })
    }

    function walkGoat(d) {
        let top, left, gt, gl
        if (d === 0 || d === 1) {
            top = -45
            left = d === 0 ? -26 : 26
            gt = -1
            gl = d === 0 ? -.5 : .5
        }
        else if (d === 4 || d === 5) {
            top = 45
            left = d === 4 ? -26 : 26
            gt = 1
            gl = d === 4 ? -.5 : .5
        } else if (d === 2 || d === 3) {
            top = 0
            left = d === 2 ? -52 : 52
            gt = 0
            gl = d === 2 ? -1 : 1
        }
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
                    {...h, active: !h.active}
                ) : h
            })
        })
    }

    function getBetweenColor(colors, f) {
        const [c1, c2] = colors.map(c => c.slice(1).match(/..?/g).map(rgb => hexToDecimal(rgb, 16)))
        const inColor = c1.map((c, i) => decToHex(Math.floor(((c * 2 * f) + (c2[i] * (2 - 2 * f)))/2)))
        return `#${inColor.join('')}`
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