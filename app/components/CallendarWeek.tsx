'use client'
import { useState } from "react"
import { ArrowBigLeft, ArrowBigRight, } from 'lucide-react';
import { horarioType } from "../types/horario";
import { Span } from "next/dist/trace";



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
        { hora: '12:00', ocupado: true, telefone: '', nome: '' },
        { hora: '12:45', ocupado: false, telefone: '', nome: '' },
        { hora: '13:30', ocupado: false, telefone: '', nome: '' },
        { hora: '14:15', ocupado: false, telefone: '', nome: '' },
        { hora: '15:00', ocupado: false, telefone: '', nome: '' },
        { hora: '15:45', ocupado: true, telefone: '', nome: '' },
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
<div className="w-full overflow-auto">
    
            <div className="w-full h-[80px] w-full bg-white flex items-center justify-self-center justify-around self-center">
                <button onClick={setAnteriorSemana} disabled={esseDia === diaInicioSemana} className={`flex w-[50px] h-[50px] ${esseDia === diaInicioSemana ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
                <h1 className="text-[40px] text- text-black">{diaInicioSemana}/{esseMês} - {diaFimSemana}/{esseMês}</h1>/
                <button onClick={setProximoSemana} className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
            </div>
    <div className="grid grid-cols-8 gap-2 mb-2">
        
        <div />

        {arrayThisWeek.map((dia) => (
            <div
                key={dia}
                className="
                    aspect-square
                    rounded-xl
                    bg-black
                    text-white
                    flex
                    items-center
                    justify-center
                    font-semibold
                "
            >
                {dia}
            </div>
        ))}
    </div>

    {/* Horários */}
    <div className="flex flex-col gap-2">
        {horarios.map((horario) => (
            <div
                key={horario.hora}
                className="grid grid-cols-8 gap-2"
            >

                {/* Hora */}
                <div
                    className="
                        aspect-square
                        rounded-xl
                        bg-zinc-200
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-medium
                    "
                >
                    {horario.hora}
                </div>

                {/* Dias */}
                {arrayThisWeek.map((dia) => (
                    <div
                        key={`${dia}-${horario.hora}`}
                        className={`
                            aspect-square
                            rounded-xl
                            transition-all
                            cursor-pointer
                            flex
                            items-center
                            justify-center
                            ${horario.ocupado
                                ? 'bg-black'
                                : 'bg-black/40'}
                                `}
                                >
                        <span    className={` w-[10px] h-[10px] rounded-full ${horario.ocupado
                                ? 'bg-black'
                                : 'bg-white'}
                                `}></span>
                    </div>
                ))}
            </div>
        ))}
    </div>
</div>
    )
}