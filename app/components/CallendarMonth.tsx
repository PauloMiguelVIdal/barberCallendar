'use client'

import { Key } from "lucide-react"
import { useState } from "react"
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

export default function CallendarMonth() {


    const months: string[] = ['Janeiro', 'fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const monthsdays30: string[] = ['Abril', 'Junho', 'Setembro', 'Novembro']
    const monthsdays28: string[] = ['fevereiro']
    const monthsdays31: string[] = ['Janeiro', 'Março', 'Maio', 'Julho', 'Agosto', 'Outubro', 'Dezembro']
    const diaSemanaNome = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const esseAno = new Date().getFullYear()
    const hoje = new Date().getDate()

    const esseMes = new Date().getMonth()
    console.log(esseMes)

    console.log(months[esseMes])
    const [mesVisualizado, setmesVisualizado] = useState(esseMes)


    function setProximoMes() {

        setmesVisualizado(mesVisualizado + 1)


    }

    function setAnteriorMes() {

        setmesVisualizado(mesVisualizado - 1)
    }




    console.log(esseAno)
    const lastMonth = new Date().getMonth() !== 0 ? new Date().getMonth() - 1 : 11
    const NextMonth = new Date().getMonth() !== 0 ? new Date().getMonth() + 1 : 11

    const lastMonthDays = new Date(esseAno, lastMonth, 0).getDate()
    // const diasNoMes = new Date(esseAno, mesVisualizado + 1, 0).getDate()
    // console.log(diasNoMes)


    // const daysMonth = diasNoMes
    const nameMonth = months[mesVisualizado]
    const primeiroDiaMês = new Date(esseAno, mesVisualizado, 1)
    const diaSemanaDiaUm = primeiroDiaMês.getDay()
    console.log(diaSemanaNome[diaSemanaDiaUm])

    const today = esseMes
    const retanguloInicio = diaSemanaDiaUm
    const retanguloTotal = 40
    // const arrayBase = retanguloInicio + daysMonth
    // const arrayFinal = retanguloTotal - arrayBase + 4
    // const totalInicial = daysMonth + retanguloInicio
    const arrayThisMonthInicial: number[] = []
    const arrayDayMonth: number[] = []
    const arrayThisMonthFinal: number[] = []
    const indexBanidos: number[] = []
    const indexTestados: number[] = []

    // 


    const diasNoMes = new Date(esseAno, mesVisualizado + 1, 0).getDate()

    const primeiroDiaSemana = new Date(
        esseAno,
        mesVisualizado,
        1
    ).getDay()

    const diasMesAnterior = new Date(
        esseAno,
        mesVisualizado,
        0
    ).getDate()

    const calendario = []

    // mês anterior
    for (
        let i = diasMesAnterior - primeiroDiaSemana + 1;
        i <= diasMesAnterior;
        i++
    ) {
        calendario.push({
            dia: i,
            atual: false,
            hoje: false,
            passado: false
        })
    }

    // mês atual
    for (let i = 1; i <= diasNoMes; i++) {
        calendario.push({
            dia: i,
            atual: true,
            hoje: i === hoje && mesVisualizado === esseMes,
            passado: i < hoje && mesVisualizado === esseMes
        })
    }

    // próximo mês
    let proxDia = 1

    while (calendario.length < 42) {
        calendario.push({
            dia: proxDia,
            atual: false
        })

        proxDia++
    }
    return (
        <div className="w-full max-w-[700px] mx-auto">
            <div className="w-full h-[80px] bg-white flex items-center justify-around self-center">
                <button onClick={setAnteriorMes} disabled={esseMes === mesVisualizado} className={`flex w-[50px] h-[50px] ${esseMes === mesVisualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
                <h1 className="text-[30px] text-black">
                    {nameMonth}
                </h1>
                <button onClick={setProximoMes} disabled={esseMes + 1 === mesVisualizado} className={`flex w-[50px] h-[50px] ${esseMes + 1 === mesVisualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigRight /></button>
            </div>
            <div className="w-full h-[60%] ">
                <div className="grid grid-cols-7 gap-2">
                    {diaSemanaNome.map((index) => (
                        <div className="text-sm text-black"
                            key={index}
                        >
                            {index}
                        </div>
                    ))}
                    {calendario.map((item, index) => (
                      
                        <div
                            key={index}
                            className={`aspect-square w-full
                                    rounded-xl
                                    flex
                                    justify-center items-center
                                    text-sm
                                    font-medium
                                    transition-all
                                    flex-col
                                    gap-[15px]
                                    pt-2
                                    ${item.hoje
                                    ? 'bg-yellow-500 text-black'
                                    : item.passado
                                        ? 'bg-black/60 text-zinc-400'
                                        : item.atual
                                            ? 'bg-black text-white'
                                            : 'bg-black/10 text-zinc-500'
                                }
                                    `}
                                    >
                            {item.dia}
                            <span className={` w-[10px] h-[10px] rounded-full ${item.hoje
                                ? 'bg-white'
                                :  item.atual? 'bg-white' : 'bg-black/20'} 
                                `}></span>
                                </div>
                    ))}
                </div>
            </div>
        </div>
    )
}