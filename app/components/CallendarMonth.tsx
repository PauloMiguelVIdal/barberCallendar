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


    const esseMes = new Date(esseAno, 6, 0).getMonth()
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
    const esseMêsDays = new Date(esseAno, esseMes, 0).getDate() + 1
    console.log(esseMêsDays)


    const daysMonth = esseMêsDays
    const nameMonth = months[mesVisualizado]
    const primeiroDiaMês = new Date(esseAno, esseMes, 1)
    const diaSemanaDiaUm = primeiroDiaMês.getDay()
    console.log(diaSemanaNome[diaSemanaDiaUm])

    const today = esseMes
    const retanguloInicio = diaSemanaDiaUm
    const retanguloTotal = 40
    const arrayBase = retanguloInicio + daysMonth
    const arrayFinal = retanguloTotal - arrayBase + 4
    const totalInicial = daysMonth + retanguloInicio
    const arrayThisMonthInicial: number[] = []
    const arrayDayMonth: number[] = []
    const arrayThisMonthFinal: number[] = []
    const indexBanidos: number[] = []
    const indexTestados: number[] = []

// 









    for (let i = lastMonthDays - retanguloInicio; i < lastMonthDays; i++) {
        arrayThisMonthInicial.push(i + 1)

    }
    for (let i = 0; i < retanguloInicio; i++) {
        indexBanidos.push(i)
        indexTestados.push(i)
    }

    for (let i = retanguloInicio + esseMêsDays; i < retanguloTotal; i++) {
        indexBanidos.push(i)
        indexTestados.push(i)
    }

    for (let dia = 1; dia < daysMonth + 1; dia++) {
        arrayDayMonth.push(dia)
    }

    for (let novaSoma = 1; novaSoma < arrayFinal-1; ++novaSoma) {
        arrayThisMonthFinal.push(novaSoma)
        console.log('foi')
    }
    const arrayThisMonth: number[] = [...arrayThisMonthInicial, ...arrayDayMonth, ...arrayThisMonthFinal]


    console.log(indexTestados)


    return (
        <div className="w-full h-full">

            <div className="w-full h-[80px] bg-white flex items-center justify-around self-center">
                <button onClick={setAnteriorMes} disabled={esseMes === mesVisualizado} className={`flex w-[50px] h-[50px] ${esseMes === mesVisualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
                <h1 className="text-[30px] text-black">
                    {nameMonth}
                </h1>
                <button onClick={setProximoMes} disabled={esseMes + 1 === mesVisualizado} className={`flex w-[50px] h-[50px] ${esseMes + 1 === mesVisualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigRight /></button>
            </div>
            <div className="w-full h-[60%] ">
                <div className="grid grid-cols-7 grid-rows-6 gap-3 bg-black ">
                    {arrayThisMonth.map((bloco, index) => (
                        <div key={index} className={`flex justify-center ${indexTestados.includes(index) ? 'bg-white/70' : 'bg-black'} items-center`}>
                            <div className="w-[40px] h-[40px] border rounded-sm p-1">{
                                bloco === 0 ? '' : bloco}</div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}