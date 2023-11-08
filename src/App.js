import React, { useState, useEffect } from "react"


export default function App() {
    const lines = 5
    const hexCount = 5
    const end = 0

    const hexLines = Array.from(Array(lines))
    const hexElement = (hc) => {
        return (
            Array.from(Array(hc)).map(hex => (
                <div className="hex"></div>
            ))
        )
    }

    const hexElements = hexLines.map((hl, i) => {
        return (
            <div className="hex-line">
                {hexElement(hexCount + (i % 2))}
            </div>
        )

    })

    const hexEnd = Array.from(Array(end)).map((he, i) => {
        return (
            <div className="hex-line">
                {hexElement(hexCount - (end - i))}
            </div>
        )
    })

    return (
        <main>
            {hexEnd}
            {hexElements}
            {[...hexEnd].reverse()}
        </main>
       
    )
}