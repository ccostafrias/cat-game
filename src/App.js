import React, { useState, useEffect } from "react"


export default function App() {
    const hexCount = 7

    const [hex, setHex] = useState(Array.from(Array(hexCount**2)))

    const hexElements = Array.from(Array(hexCount**2)).map((hl, i) => {
        const column = i % 7
        const row = (i - column) / 7
        const style = row % 2 ? {
            left: 'calc(54px * var(--scale))'
        } : null
        return (
            <div 
                className="hex"
                data-column={column} 
                data-row={row}
                style={style}
            />
        )

    })

    return (
        <main style={{
            gridTemplateColumns: `repeat(${hexCount}, 1fr)`,
        }}>
            {hexElements}
        </main>
       
    )
}