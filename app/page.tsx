'use client'

import Callendar from "./components/Callendar";
import Horario from "./components/Horario";
import { ArrowBigLeft, ArrowBigRight, Calendar, Calendar1, CalendarCheck, CalendarDays } from 'lucide-react';
import CallendarMonth from "./components/CallendarMonth";
import { useState } from "react";
import CallendarWeek from "./components/CallendarWeek";
export default function Home() {
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
    }else{
      setDiaVizualizado(diaVizualizado + 1)
    }

  }

  function setAnteriorDia() {

    setDiaVizualizado(diaVizualizado - 1)
  }


  return (
    <div className="h-screen flex flex-col justify-center bg-zinc-50">
      <header>
        <div className="h-[100px] border-b bg-black">
          <h1 className=" text-center text-2xl p-4">
            BARBEARIA
          </h1>
        </div>
        <div className="w-full h-[80px] bg-white fixed flex items-center justify-around self-center">
          <button onClick={setAnteriorDia} disabled={esseDia === diaVizualizado} className={`flex w-[50px] h-[50px] ${esseDia === diaVizualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
          <h1 className="text-[40px] text- text-black">{diaVizualizado}/{esseMês}</h1>/
          <button onClick={setProximoDia} className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        {/* <Callendar /> */}
        {/* <CallendarMonth /> */}

        <CallendarWeek/>
      </main>
      <footer className="border-t bg-black p-4 flex items-center justify-center">
        <div className="flex w-[90%] justify-center">
          <div className="flex w-[60%] justify-between">

            <button className={`flex justify-center rounded-xl border-solid border-white border-1 items-center w-[50px] aspect-square bg-linear-to-br from-black to-[#D3AF37]`}>
              <Calendar1 />
            </button>
            <button className="flex justify-center rounded-xl border-solid border-white border-1 items-center w-[50px] aspect-square  bg-linear-to-br from-black to-white/40">
              <Calendar />
            </button>
            <button className="flex justify-center rounded-xl border-solid border-white border-1 items-center w-[50px] aspect-square  bg-linear-to-br from-black to-white/40">
              <CalendarDays />
            </button>
          </div>
          <div className="w-[40%] flex justify-end">
            <button className="flex justify-center rounded-xl border-solid border-white border-1 items-center w-[50px] aspect-square  bg-linear-to-br from-black to-white/40">
              <CalendarCheck />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
