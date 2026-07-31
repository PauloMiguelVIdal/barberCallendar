'use client'
import { useState } from 'react'

import { AgendamentoType } from '../types/Agendamento'
import {
    CalendarCheck,
    Clock,
    Scissors,
    UserRound,
    Phone,
    ArrowLeft,
    X
} from 'lucide-react'

import {
    useCentralDados
} from './PersistData'


export default function Appointments() {

    // =========================================================
    // CONTEXT
    // =========================================================


const {
    agendamentosCliente,
    removerAgendamento,
    removerAgendamentoCliente,
    setInterfaceView
} = useCentralDados()

const [
    modalCancelar,
    setModalCancelar
] = useState(false)

const [
    agendamentoSelecionado,
    setAgendamentoSelecionado
] = useState<AgendamentoType | null>(null)



    // =========================================================
    // FORMATAR DATA
    // =========================================================

    function formatarData(
        data: string
    ) {

        const [
            ano,
            mes,
            dia
        ] = data.split('-')


        return `${dia}/${mes}/${ano}`

    }

function abrirCancelar(
    agendamento: AgendamentoType
) {

    setAgendamentoSelecionado(
        agendamento
    )

    setModalCancelar(
        true
    )

}

function cancelarAgendamento() {

    if (!agendamentoSelecionado) {

        return

    }

    removerAgendamento(
        agendamentoSelecionado.id
    )

    removerAgendamentoCliente(
        agendamentoSelecionado.id
    )

    setModalCancelar(
        false
    )

    setAgendamentoSelecionado(
        null
    )

}
    // =========================================================
    // ORDENAR AGENDAMENTOS
    // =========================================================

    const agendamentosOrdenados = [
        ...agendamentosCliente
    ].sort((a, b) => {

        const dataA =
            `${a.data} ${a.hora}`

        const dataB =
            `${b.data} ${b.hora}`

        return dataA.localeCompare(dataB)

    })


    // =========================================================
    // TELA SEM AGENDAMENTOS
    // =========================================================

    if (
        agendamentosOrdenados.length === 0
    ) {

        return (

            <div className="
                w-full
                min-h-full
                flex
                flex-col
                items-center
                justify-center
                gap-6
                bg-[#121212]
                text-[#E0E0E0]
                p-4
                rounded-xl
            ">

                <div className="
                    w-[80px]
                    aspect-square
                    rounded-full
                    bg-[#1E1E1E]
                    flex
                    items-center
                    justify-center
                    border-2
                    border-[#D3AF37]
                ">

                    <CalendarCheck
                        color="#D3AF37"
                        size={40}
                    />

                </div>


                <div className="
                    flex
                    flex-col
                    items-center
                    gap-2
                    text-center
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        text-[#FFFFFF]
                    ">

                        Nenhum agendamento

                    </h2>


                    <p className="
                        text-sm
                        text-[#A0A0A0]
                    ">

                        Você ainda não possui
                        nenhum horário agendado.

                    </p>

                </div>


                <button

                    type="button"

                    onClick={() =>
                        setInterfaceView('day')
                    }

                    className="
                        bg-[#D3AF37]
                        text-[#121212]
                        px-6
                        py-3
                        rounded-xl
                        font-bold
                        flex
                        items-center
                        gap-2
                        hover:bg-[#C4A032]
                        transition-all
                        duration-200
                        hover:scale-105
                    "

                >

                    <ArrowLeft size={18} />

                    Voltar para o calendário

                </button>

            </div>

        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            w-full
            flex
            flex-col
            gap-5
            bg-[#121212]
            p-4
            rounded-xl
            text-[#E0E0E0]
        ">


            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                border-b
                border-[#2A2A2A]
                pb-4
            ">


                <div className="
                    flex
                    flex-col
                    gap-1
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-[#FFFFFF]
                    ">

                        Meus agendamentos

                    </h1>


                    <p className="
                        text-sm
                        text-[#A0A0A0]
                    ">

                        Horários reservados neste dispositivo

                    </p>

                </div>


                <CalendarCheck
                    size={30}
                    color="#D3AF37"
                />

            </div>


            {/* =================================================
                LISTA
            ================================================= */}

            <div className="
                flex
                flex-col
                gap-4
            ">

                {agendamentosOrdenados.map(
                    agendamento => (

                        <div

                            key={
                                agendamento.id
                            }

                            className="
                                w-full
                                bg-[#1E1E1E]
                                border
                                border-[#2A2A2A]
                                rounded-2xl
                                p-5
                                flex
                                flex-col
                                gap-4
                                shadow-lg
                                transition-all
                                duration-200
                                hover:border-[#D3AF37]
                            "

                        >


                            {/* =================================
                                DATA E HORÁRIO
                            ================================= */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">


                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <div className="
                                        w-[45px]
                                        aspect-square
                                        rounded-xl
                                        bg-[#2A2A2A]
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-[#D3AF37]
                                    ">

                                        <CalendarCheck
                                            color="#D3AF37"
                                            size={22}
                                        />

                                    </div>


                                    <div className="
                                        flex
                                        flex-col
                                    ">

                                        <span className="
                                            font-bold
                                            text-lg
                                            text-[#FFFFFF]
                                        ">

                                            {formatarData(
                                                agendamento.data
                                            )}

                                        </span>


                                        <span className="
                                            text-sm
                                            text-[#A0A0A0]
                                            flex
                                            items-center
                                            gap-1
                                        ">

                                            <Clock
                                                size={14}
                                                color="#757575"
                                            />

                                            {agendamento.hora}

                                        </span>

                                    </div>

                                </div>


                                <span className="
                                    bg-[#2A2A2A]
                                    text-[#D3AF37]
                                    text-xs
                                    font-bold
                                    px-3
                                    py-1
                                    rounded-full
                                    border
                                    border-[#D3AF37]
                                ">

                                    AGENDADO

                                </span>

                            </div>


                            {/* =================================
                                DIVISÓRIA
                            ================================= */}

                            <div className="
                                w-full
                                h-px
                                bg-[#2A2A2A]
                            " />


                            {/* =================================
                                CLIENTE
                            ================================= */}

                            <div className="
                                flex
                                flex-col
                                gap-2
                            ">


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-[#E0E0E0]
                                ">

                                    <UserRound
                                        size={17}
                                        color="#A0A0A0"
                                    />

                                    <span>
                                        {agendamento.nome}
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-[#E0E0E0]
                                ">

                                    <Phone
                                        size={17}
                                        color="#A0A0A0"
                                    />

                                    <span>
                                        {agendamento.telefone}
                                    </span>

                                </div>

                            </div>


                            {/* =================================
                                DURAÇÃO
                            ================================= */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                bg-[#2A2A2A]
                                rounded-xl
                                p-3
                            ">


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-[#A0A0A0]
                                ">

                                    <Scissors
                                        size={17}
                                        color="#757575"
                                    />

                                    <span>
                                        Duração estimada
                                    </span>

                                </div>


                                <strong className="text-[#FFFFFF]">

                                    {agendamento.duracao ?? 0} min

                                </strong>

                            </div>

                            <button

                                type="button"

                                onClick={() =>
                                    abrirCancelar(
                                        agendamento
                                    )
                                }

                                className="
                                    w-full
                                    rounded-xl
                                    border-2
                                    border-[#D32F2F]
                                    text-[#FF4D4D]
                                    py-3
                                    font-semibold
                                    hover:bg-[#D32F2F]
                                    hover:text-[#FFFFFF]
                                    transition-all
                                    duration-200
                                "

                            >

                                Cancelar agendamento

                            </button>

                        </div>

                    )
                )}

            </div>


            {/* =================================================
                VOLTAR
            ================================================= */}

            <button

                type="button"

                onClick={() =>
                    setInterfaceView('day')
                }

                className="
                    w-full
                    bg-[#D3AF37]
                    text-[#121212]
                    p-4
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    gap-2
                    font-bold
                    hover:bg-[#C4A032]
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                "

            >

                <ArrowLeft
                    size={20}
                />

                Voltar para o calendário

            </button>

            {
                modalCancelar &&

                <div className="
                    fixed
                    inset-0
                    bg-[#121212]/90
                    flex
                    items-center
                    justify-center
                    z-50
                    p-4
                ">

                    <div className="
                        bg-[#1E1E1E]
                        rounded-2xl
                        p-6
                        w-[90%]
                        max-w-[380px]
                        flex
                        flex-col
                        gap-6
                        border
                        border-[#2A2A2A]
                    ">

                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setModalCancelar(false)
                                    setAgendamentoSelecionado(null)
                                }}
                                className="
                                    bg-[#2A2A2A]
                                    rounded-full
                                    p-2
                                    hover:bg-[#333333]
                                    transition-colors
                                "
                            >
                                <X size={20} color="#757575" />
                            </button>
                        </div>

                        <div className="text-center">

                            <h2 className="
                                text-xl
                                font-bold
                                text-[#FFFFFF]
                            ">

                                Cancelar agendamento?

                            </h2>

                            <p className="
                                text-sm
                                text-[#A0A0A0]
                                mt-2
                            ">

                                Esta ação não poderá ser desfeita.

                            </p>

                        </div>


                        <div className="
                            flex
                            gap-3
                        ">

                            <button

                                onClick={() => {

                                    setModalCancelar(
                                        false
                                    )

                                    setAgendamentoSelecionado(
                                        null
                                    )

                                }}

                                className="
                                    flex-1
                                    border-2
                                    border-[#333333]
                                    rounded-xl
                                    py-3
                                    font-semibold
                                    text-[#E0E0E0]
                                    hover:bg-[#2A2A2A]
                                    transition-colors
                                "

                            >

                                Voltar

                            </button>


                            <button

                                onClick={
                                    cancelarAgendamento
                                }

                                className="
                                    flex-1
                                    rounded-xl
                                    bg-[#D32F2F]
                                    text-[#FFFFFF]
                                    py-3
                                    font-semibold
                                    hover:bg-[#B71C1C]
                                    transition-colors
                                "

                            >

                                Cancelar

                            </button>

                        </div>

                    </div>

                </div>
            }

        </div>

    )

}