'use client'
import { useState } from "react"
import { ArrowBigLeft, ArrowBigRight, } from 'lucide-react';
import { horarioType } from "../types/horario";
import { Span } from "next/dist/trace";



export default function CallendarWeek({ horario }) {
    const [dataVisualizada, setDataVisualizada] = useState(new Date())

    const inicioSemana = new Date(dataVisualizada)

    inicioSemana.setDate(
        dataVisualizada.getDate() - dataVisualizada.getDay()
    )


    const diaSemanaNome = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

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



    const diasSemana = []

    for (let i = 0; i < 7; i++) {
        const dia = new Date(inicioSemana)

        dia.setDate(inicioSemana.getDate() + i)

        diasSemana.push(dia)
    }

const primeiroDia = diasSemana[0]
const ultimoDia = diasSemana[6]



function proximaSemana() {
  const novaData = new Date(dataVisualizada)

  novaData.setDate(novaData.getDate() + 7)

  setDataVisualizada(novaData)
}

function semanaAnterior() {
  const novaData = new Date(dataVisualizada)

  novaData.setDate(novaData.getDate() - 7)

  setDataVisualizada(novaData)
}

    return (
        <div className="w-full overflow-auto">

            <div className="w-full h-[80px] w-full bg-white flex items-center justify-self-center justify-around self-center">
                <button onClick={semanaAnterior} className={`flex w-[50px] h-[50px] 

                    rounded-full items-center justify-center`}><ArrowBigLeft /></button>
<h1 className="text-[40px] text-black">
  {primeiroDia.getDate()}/{primeiroDia.getMonth() + 1}
  {" - "}
  {ultimoDia.getDate()}/{ultimoDia.getMonth() + 1}
</h1>                <button onClick={proximaSemana} className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
            </div>
            <div className="grid grid-cols-8 gap-2 mb-2">

                <div />

                {diasSemana.map((dia) => (
                    <div
                        key={dia.getDate()}
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
                       {dia.getDate()}
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
                        bg-black
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
                        {diasSemana.map((dia) => (
                            <div
                                key={`${dia}-${horario.hora}`}
                                className={`
                            aspect-square
                            rounded-xl
                            transition-all
                            cursor-pointer
                            flex
                            flex-col
                            items-center
                            justify-center
                            ${horario.ocupado
                                        ? 'bg-black'
                                        : 'bg-black/40'}
                                `}
                            >
                                {horario.ocupado ? 'ocupa' : 'disp'}
                                <span className={` w-[10px] h-[10px] rounded-full ${horario.ocupado
                                    ? 'bg-black'
                                    : 'bg-white'}
                                    `}>
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}