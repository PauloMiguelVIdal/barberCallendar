'use client'
import { useState } from "react"
import { ArrowBigLeft, ArrowBigRight,} from 'lucide-react';

export default function CallendarWeek() {
    const esseAno = new Date().getFullYear()
    const esseMês = new Date().getMonth()
    const esseDia = new Date().getDay()
    const esseMêsDays = new Date(esseAno, esseMês, 0).getDate()

    const [diaVizualizado, setDiaVizualizado] = useState(esseDia)
    const [mesVizualizado, setMesVizualizado] = useState(esseMês)

    function setProximoDia() {
        if (esseMêsDays === diaVizualizado) {
            console.log(esseMês)
            setDiaVizualizado(1)
            setMesVizualizado(mesVizualizado + 1)
        } else {
            setDiaVizualizado(diaVizualizado + 1)
        }

    }

    function setAnteriorDia() {

        setDiaVizualizado(diaVizualizado - 1)
    }



    const arrayThisWeek: number[] = []
    const arrayThisDay: number[] = []




    const diaInicio = 12
    const totalBlocos = 15

    for (let i = diaInicio; i < diaInicio + 7; i++) {
        arrayThisWeek.push(i)
    }
    for (let i = 1; i < totalBlocos + 1; i++) {
        arrayThisDay.push(i)
    }
    console.log(arrayThisWeek)




    return (
    <div className="w-full h-full"> 
            <div className="w-full h-[80px] bg-white fixed flex items-center justify-around self-center">
                <button onClick={setAnteriorDia} disabled={esseDia === diaVizualizado} className={`flex w-[50px] h-[50px] ${esseDia === diaVizualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
                <h1 className="text-[40px] text- text-black">{diaVizualizado}/{esseMês}</h1>/
                <button onClick={setProximoDia} className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
            </div>
            <div className="w-full h-[100%]">
                <div className="grid w-full grid-cols-7 h-full grid-rows-1 bg-black ">
                    {arrayThisWeek.map((index) => (
                        <div key={index} className={`flex flex-col ${index > 16 ? 'bg-pink-500' : 'bg-white'} justify-center h-full w-full items-center`}>
                            <div>
                                {index}
                            </div>
                            <div className={`flex flex-col h-full items-center justify-around  ${index > 16 ? 'bg-pink-500' : 'bg-white'} bg-blue-500 w-full`}>
                                {arrayThisDay.map((index) => (
                                    <div key={index} className={`flex justify-center bg-black rounded-xl m-1 h-full aspect-square items-center`}>
                                        {index}
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}