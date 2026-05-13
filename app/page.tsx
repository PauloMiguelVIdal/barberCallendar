import Callendar from "./components/Callendar";
import Horario from "./components/Horario";


export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center bg-zinc-50">
      <header>
        <h1 className="border-b bg-white p-4">
          Barbearia
        </h1>
              <div className="w-full h-[50px] bg-white fixed flex items-center justify-around self-center">
                <button className="w-[50px] h-[50px] bg-black rounded-full">-</button>
                <h1 className="text-[40px] text-black">21/05</h1>
                <button className="w-[50px] h-[50px] bg-black rounded-full">+</button>
              </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Callendar />
      </main>
      <footer className="border-t bg-white p-4">
      </footer>
    </div>
  );
}
