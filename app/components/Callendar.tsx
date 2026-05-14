'use client'

import { useState } from "react"

import Horario from "./Horario";
import Formulario from "./Formulario";
import { horarioType } from '../types/horario'



export default function Callendar() {



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
  )
}