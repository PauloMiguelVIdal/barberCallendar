'use client'
import {horarioType} from '../types/horario'

type Props = {
    horario: {
        hora: string
        ocupado: boolean
    }
    onSelecionar: (horario: horarioType) => void
}

export default function Horario({ horario, onSelecionar }: Props) {

    // if(horario.ocupado === true)return

    if (horario.ocupado === true) {

    }

const estadoOcupação = horario.ocupado ? 'ocupado': 'livre'

    return (

        <button disabled={horario.ocupado} onClick={() => onSelecionar(horario)} className={`  w-full rounded-xl h-[80px] mt-[10px]  ${horario.ocupado?'bg-black/80':'bg-black'}   p-4 flex justify-between item-center`}>
            
            <h2 className="self-start text-3xl">
                {estadoOcupação} 
            </h2>
            <div className="self-end text-sm">
                {horario.hora}
            </div>
        </button>

    )
} 