'use client'
import { useState } from "react"
import Services from "./Services"
import { servicesType } from "../types/service"
import { X } from 'lucide-react';
import {CalendarCheck2} from 'lucide-react';

type props = {
    horario: string
    fecharModal: () => void
    agendarHorario: (nome: string, telefone: string) => void

}







export default function Formulario({ horario, fecharModal, agendarHorario,

}: props) {




    const [services, setServices] = useState<servicesType[]>([
        {
            checkbox: false
            , serviço: 'Corte social'
            , price: 40
        },
        {
            checkbox: false
            , serviço: 'Corte navalhado'
            , price: 40
        },
        {
            checkbox: false
            , serviço: 'Tintura'
            , price: 20
        },
        {
            checkbox: false
            , serviço: 'barba'
            , price: 30
        },
        {
            checkbox: false
            , serviço: 'Sobrancelha'
            , price: 10
        },
    ]);






    function selecionarServiços(index: number) {
        setServices((prev) =>
            prev.map((service, i) =>
                i === index
                    ? { ...service, checkbox: !service.checkbox }
                    : service


            ))
    }


    const somaFatu = services.filter((serviço) =>
        serviço.checkbox)
        .reduce((acc, serviço) =>
            acc + serviço.price, 0)

        
        const [nome, setNome] = useState<string>('')
        const NomeFormatado = nome.toLocaleUpperCase;
    const [telefone, setTelefone] = useState<string>('')
    return (

        <div className="w-full h-screen bg-black/80 fixed top-0 left-0 z-[100] flex flex-col items-center justify-center  p-4 gap-2 mt-[5px]">
            <div className="w-[90%] h-[80%] bg-white flex flex-col p-4 gap-2 mt-[5px] rounded-xl items-center justify-between">
                <button className="bg-black flex items-center justify-center rounded-xl w-[35px] aspect-square absolute top-[10%] right-[5%]" onClick={fecharModal}><X/></button>

                <div>
                    {/* <h1 className="text-black text-xl text-center"> agendando horario para {horario}</h1> */}

                    <input 
  type="text"    className="text-black focus:black bg-black/30 mt-3 pl-[10px] w-full self-center h-[40px] rounded-sm uppercase" 
  onChange={(e) => setNome(e.target.value.toUpperCase())} placeholder="NOME" />
<input 
  type="text" 
  placeholder="TELEFONE" 
  className="text-black focus:black bg-black/30 mt-3 pl-[10px] w-full self-center h-[40px] rounded-sm uppercase" 
  onChange={(e) => setTelefone(e.target.value.toUpperCase())} 
/>                </div>
<div className="bg-black w-full rounded-xl gap-4">
                {services.map((serviço, index) => (
                    <Services key={serviço.serviço} serviços={serviço}
                        onServices={() => selecionarServiços(index)}
                    />
                ))}
</div>
                <div className="w-[90%] flex justify-between">
                <h2 className="text-black">{horario} </h2>
                <h2 className="text-black">Total R$: {somaFatu}</h2>
                </div>

                <div className="w-full rounded-xl bg-black flex items-center">
                    <button className="w-full bg-whitre p-4 flex items-center justify-around rounded-xl" onClick={() => {
                        if (nome && telefone) {
                            agendarHorario(nome, telefone)
                        } else {
                            alert('Preencha todos os campos para realizar o agendamento')
                        }
                    }}>
                        <CalendarCheck2/><h2 className="text-Bold text-center">CONFIRMAR AGENDAMENTO</h2></button>
                </div>
            </div>
        </div>
    )
}

