import Callendar from "./components/Callendar";
import Horario from "./components/Horario";
import { ArrowBigLeft, ArrowBigRight, Calendar, Calendar1, CalendarCheck, CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center bg-zinc-50">
      <header>
        <div className="h-[100px] border-b bg-black">
          <h1 className=" text-center text-2xl p-4">
            BARBEARIA
          </h1>
        </div>
        <div className="w-full h-[80px] bg-white fixed flex items-center justify-around self-center">
          <button className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigLeft /></button>
          <h1 className="text-[40px] text-black">21/05</h1>
          <button className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        <Callendar />
      </main>
      <footer className="border-t bg-black p-4 flex items-center justify-center">
        <div className="flex w-[90%] justify-center">
          <div className="flex w-[60%] justify-between">

            <button className="flex justify-center rounded-xl border-solid border-white border-1 items-center w-[50px] aspect-square  bg-linear-to-br from-black to-white/40">
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
