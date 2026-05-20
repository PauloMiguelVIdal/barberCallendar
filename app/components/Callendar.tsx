'use client'

import { useState } from "react"

import Horario from "./Horario";
import Formulario from "./Formulario";
import { horarioType } from '../types/horario'
import { ArrowBigLeft, ArrowBigRight} from 'lucide-react';



export default function Callendar() {

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


  const [horarios, setHorarios] = useState<horarioType[]>([
    { hora: '9:00', ocupado: false, telefone: '', nome: '' },
    { hora: '9:45', ocupado: false, telefone: '', nome: '' },
    { hora: '10:30', ocupado: false, telefone: '', nome: '' },
    { hora: '11:15', ocupado: false, telefone: '', nome: '' },
    { hora: '12:00', ocupado: false, telefone: '', nome: '' },
    { hora: '12:45', ocupado: false, telefone: '', nome: '' },
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

  const [horarioSelecionado, setHorarioselecionado] = useState<horarioType | null>(null)
  const [modalAgendamento, setModalAgendamento] = useState(false)


  function agendarHorario(nome: string, telefone: string) {

    if (!horarioSelecionado) return

    setHorarios(
      horarios.map((horario) => {
        if (horario.hora === horarioSelecionado.hora) {
          return {
            ...horario,
            ocupado: true,
            nome,
            telefone
          }
        }
        return horario
      }
      )
    )
    setModalAgendamento(false)
  }

  return (
    <div className="w-full h-full"> 
      <div className="w-full h-[80px] bg-white fixed flex items-center justify-self-center justify-around self-center">
        <button onClick={setAnteriorDia} disabled={esseDia === diaVizualizado} className={`flex w-[50px] h-[50px] ${esseDia === diaVizualizado ? 'bg-black/30' : 'bg-black'} rounded-full items-center justify-center`}><ArrowBigLeft /></button>
        {/* <h1 className="text-[40px] text- text-black">{diaVizualizado}/{esseMês}</h1>/ */}
<h1 className="absolute left-1/2 -translate-x-1/2 text-[40px] text-black">
  15/5
</h1>        <button onClick={setProximoDia} className="flex w-[50px] h-[50px] bg-black rounded-full items-center justify-center"><ArrowBigRight /></button>
      </div>
      <div className="flex items-center flex-col">

        {horarios.map((horario) => (
          <Horario
            key={horario.hora}
            horario={horario}
            onSelecionar={(horario) => {

              setHorarioselecionado(horario),
                setModalAgendamento(true)
            }}
          />
        ))}
        {modalAgendamento && horarioSelecionado && <Formulario horario={horarioSelecionado.hora} fecharModal={() => setModalAgendamento(false)} agendarHorario={agendarHorario} />}
      </div>
    </div>
  )
}