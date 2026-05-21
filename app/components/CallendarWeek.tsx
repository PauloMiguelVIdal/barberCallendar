'use client'
import { useState } from "react"
import { ArrowBigLeft, ArrowBigRight, } from 'lucide-react';
import { horarioType } from "../types/horario";



export default function CallendarWeek({ horario }) {
    const esseAno = new Date().getFullYear()
    const esseMês = new Date().getMonth()
    const esseDia = new Date().getDay()
    const esseMêsDays = new Date(esseAno, esseMês, 0).getDate()


    const [horarios, setHorarios] = useState<horarioType[]>([
        { hora: '9:00', ocupado: false, telefone: '', nome: '' },
        { hora: '9:45', ocupado: false, telefone: '', nome: '' },
        { hora: '10:30', ocupado: false, telefone: '', nome: '' },
        { hora: '11:15', ocupado: false, telefone: '', nome: '' },
        { hora: '12:00', ocupado: false, telefone: '', nome: '' },
        { hora: '12:45', ocupado: true, telefone: '', nome: '' },
        { hora: '13:30', ocupado: false, telefone: '', nome: '' },
        { hora: '14:15', ocupado: false, telefone: '', nome: '' },
        { hora: '15:00', ocupado: false, telefone: '', nome: '' },
        { hora: '15:45', ocupado: false, telefone: '', nome: '' },
        { hora: '16:30', ocupado: false, telefone: '', nome: '' },
        { hora: '17:15', ocupado: false, telefone: '', nome: '' },
        { hora: '18:00', ocupado: false, telefone: '', nome: '' },
        { hora: '18:45', ocupado: false, telefone: '', nome: '' },
        { hora: '19:30', ocupado: false, telefone: '', nome: '' }
    ]);


    const [semanaVizualizado, setSemanaVizualizado] = useState(esseDia)
    const [mesVizualizado, setMesVizualizado] = useState(esseMês)

    function setProximoSemana() {
        if (esseMêsDays === diaInicioSemana) {
            console.log(esseMês)
            setSemanaVizualizado(1)
            setMesVizualizado(mesVizualizado + 1)
        } else {
            setSemanaVizualizado(diaInicioSemana + 1)
        }

    }

    function setAnteriorSemana() {

        setSemanaVizualizado(diaInicioSemana - 1)
    }



    const arrayThisWeek: number[] = []
    const arrayThisDay: number[] = []




    const diaInicioSemana = 12
    const diaFimSemana = 18
    const totalBlocos = 15

    for (let i = diaInicioSemana; i < diaInicioSemana + 7; i++) {
        arrayThisWeek.push(i)
    }
    for (let i = 1; i < totalBlocos + 1; i++) {
        arrayThisDay.push(i)
    }
    console.log(arrayThisWeek)




    return (
        <div className="w-full h-full">
            <div className="w-full h-[80px] w-full bg-white flex items-center justify-self-center justify-around self-center">
                <button onClick={setAnteriorSemana} disabled={esseDia === diaInicioSemana} className={`flex w-[50px] h-[50px] ${esseDia === diaInicioSemana ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
                <h1 className="text-[40px] text- text-black">{diaInicioSemana}/{esseMês} - {diaFimSemana}/{esseMês}</h1>/
                <button onClick={setProximoSemana} className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
            </div>
            <div className="w-full h-[100%]">
                <div className="grid w-full grid-cols-8 h-full grid-rows-1 bg-black ">
                    <div className="grid-col-1">
                        
                        {horarios.map((indice: horarioType) => (
                            <h1 className="text-center">{indice.hora}</h1>
                        ))}
                    </div>
                    {arrayThisWeek.map((index) => (
                        <div key={index} className={`flex flex-col ${index > 16 ? 'bg-pink-500' : 'bg-white'} justify-center h-full w-full items-center`}>
                            <div>
                                {index}
                            </div>
                            <div className={`flex flex-col h-full items-center justify-around  ${index > 16 ? 'bg-pink-500' : 'bg-white'} bg-blue-500 w-full`}>


                                {horarios.map((index) => (
                                    <div key={index} className={`flex justify-center ${index.ocupado?'bg-white' :'bg-black'}  rounded-xl m-1 h-full aspect-square items-center`}>
                                        {index.ocupado}
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