'use client'

import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

import { horarioType } from '../types/horario'

import {
    useCentralDados,
    useAgendamentos
} from '../context/PersistData'


export default function CallendarWeek() {

    // =========================================================
    // CONTEXT - DATA
    // =========================================================

    const {
        dataVisualizada,
        proximaSemana,
        semanaAnterior,
        definirDataVisualizada,
        selecionarHorario,
        setInterfaceView
    } = useCentralDados()


    // =========================================================
    // CONTEXT - AGENDAMENTOS
    // =========================================================

    const {
        agendamentos
    } = useAgendamentos()


    // =========================================================
    // HORÁRIOS DISPONÍVEIS
    // =========================================================

    const horarios: horarioType[] = [

        { hora: '9:00', ocupado: false },

        { hora: '9:45', ocupado: false },

        { hora: '10:30', ocupado: false },

        { hora: '11:15', ocupado: false },

        { hora: '12:00', ocupado: false },

        { hora: '12:45', ocupado: false },

        { hora: '13:30', ocupado: false },

        { hora: '14:15', ocupado: false },

        { hora: '15:00', ocupado: false },

        { hora: '15:45', ocupado: false },

        { hora: '16:30', ocupado: false },

        { hora: '17:15', ocupado: false },

        { hora: '18:00', ocupado: false },

        { hora: '18:45', ocupado: false },

        { hora: '19:30', ocupado: false }

    ]


    // =========================================================
    // INÍCIO DA SEMANA
    // =========================================================

    const inicioSemana = new Date(dataVisualizada)

    inicioSemana.setHours(0, 0, 0, 0)

    inicioSemana.setDate(
        dataVisualizada.getDate() -
        dataVisualizada.getDay()
    )


    // =========================================================
    // HOJE
    // =========================================================

    const hoje = new Date()

    hoje.setHours(
        0,
        0,
        0,
        0
    )


    // =========================================================
    // VERIFICAR SE DATA ESTÁ NO PASSADO
    // =========================================================

    function dataEstaNoPassado(
        data: Date
    ) {

        const dataVerificacao =
            new Date(data)

        dataVerificacao.setHours(
            0,
            0,
            0,
            0
        )

        return (
            dataVerificacao.getTime() <
            hoje.getTime()
        )

    }


    // =========================================================
    // SELECIONAR HORÁRIO DA SEMANA
    // =========================================================

    function selecionarHorarioDaSemana(
        dia: Date,
        hora: string
    ) {

        // ================================================
        // NÃO PERMITIR DIAS PASSADOS
        // ================================================

        if (
            dataEstaNoPassado(dia)
        ) {

            return

        }


        definirDataVisualizada(dia)

        selecionarHorario(hora)

        setInterfaceView('day')

    }


    // =========================================================
    // DIAS DA SEMANA
    // =========================================================

    const diasSemana: Date[] = []

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const dia =
            new Date(inicioSemana)

        dia.setDate(
            inicioSemana.getDate() + i
        )

        dia.setHours(
            0,
            0,
            0,
            0
        )

        diasSemana.push(dia)

    }


    // =========================================================
    // PRIMEIRO E ÚLTIMO DIA
    // =========================================================

    const primeiroDia =
        diasSemana[0]

    const ultimoDia =
        diasSemana[6]


    // =========================================================
    // INÍCIO DA SEMANA ATUAL
    // =========================================================

    const inicioSemanaAtual =
        new Date(hoje)

    inicioSemanaAtual.setDate(
        hoje.getDate() -
        hoje.getDay()
    )

    inicioSemanaAtual.setHours(
        0,
        0,
        0,
        0
    )


    const estaNaSemanaAtual =
        inicioSemana.getTime() ===
        inicioSemanaAtual.getTime()


    // =========================================================
    // FORMATAR DATA
    // =========================================================

    function formatarData(
        data: Date
    ) {

        return `${data.getFullYear()}-${String(
            data.getMonth() + 1
        ).padStart(2, '0')}-${String(
            data.getDate()
        ).padStart(2, '0')}`

    }


    // =========================================================
    // ABRIR DIA
    // =========================================================

    function abrirDia(
        dia: Date,
        hora: string
    ) {

        // ================================================
        // NÃO PERMITIR DATA PASSADA
        // ================================================

        if (
            dataEstaNoPassado(dia)
        ) {

            return

        }


        definirDataVisualizada(dia)

        selecionarHorario(hora)

        setInterfaceView('day')

    }


    // =========================================================
    // VERIFICAR SE HORÁRIO ESTÁ OCUPADO
    // =========================================================

    function horarioEstaOcupado(
        dia: Date,
        hora: string
    ) {

        const data =
            formatarData(dia)

        return agendamentos.some(
            (agendamento) =>

                agendamento.data === data &&

                agendamento.hora === hora

        )

    }


    // =========================================================
    // NOMES DOS DIAS
    // =========================================================

    const diaSemanaNome = [

        'Domingo',

        'Segunda-feira',

        'Terça-feira',

        'Quarta-feira',

        'Quinta-feira',

        'Sexta-feira',

        'Sábado'

    ]


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="w-full overflow-auto bg-[#121212] p-4 rounded-xl">


            {/* =====================================================
                CABEÇALHO
            ====================================================== */}

            <div className="
                w-full
                h-[80px]
                bg-[#121212]
                flex
                items-center
                justify-around
                border-b
                border-[#2A2A2A]
                mb-4
            ">


                {/* SEMANA ANTERIOR */}

                <button

                    onClick={semanaAnterior}

                    disabled={estaNaSemanaAtual}

                    className={`
                        flex
                        w-[50px]
                        h-[50px]
                        rounded-full
                        items-center
                        justify-center
                        transition-all
                        duration-200

                        ${estaNaSemanaAtual
                            ? 'bg-[#333333] cursor-not-allowed'
                            : 'bg-[#D3AF37] hover:bg-[#C4A032] hover:scale-105'
                        }
                    `}

                >

                    <ArrowBigLeft 
                        color={estaNaSemanaAtual ? '#757575' : '#121212'} 
                        size={24}
                    />

                </button>


                {/* PERÍODO */}

                <h1 className="
                    text-[25px]
                    text-[#FFFFFF]
                    font-bold
                    text-center
                ">

                    {primeiroDia.getDate()}
                    /
                    {primeiroDia.getMonth() + 1}

                    {' - '}

                    {ultimoDia.getDate()}
                    /
                    {ultimoDia.getMonth() + 1}

                </h1>


                {/* PRÓXIMA SEMANA */}

                <button

                    onClick={proximaSemana}

                    className="
                        flex
                        w-[50px]
                        h-[50px]
                        bg-[#D3AF37]
                        rounded-full
                        items-center
                        justify-center
                        hover:bg-[#C4A032]
                        hover:scale-105
                        transition-all
                        duration-200
                    "

                >

                    <ArrowBigRight 
                        color="#121212" 
                        size={24}
                    />

                </button>


            </div>


            {/* =====================================================
                CABEÇALHO DOS DIAS
            ====================================================== */}

            <div className="
                grid
                grid-cols-8
                gap-2
                mb-4
            ">


                {/* ESPAÇO DO HORÁRIO */}

                <div />


                {/* DIAS */}

                {diasSemana.map(
                    (
                        dia,
                        index
                    ) => {

                        const passado =
                            dataEstaNoPassado(dia)

                        const isHoje = 
                            dia.getTime() === hoje.getTime()


                        return (

                            <div

                                key={formatarData(dia)}

                                className={`
                                    aspect-square
                                    rounded-xl
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    font-semibold
                                    transition-all
                                    duration-200
                                    border-2

                                    ${passado
                                        ? 'bg-[#333333] border-[#333333]'
                                        : isHoje
                                            ? 'bg-[#1E1E1E] border-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'
                                            : 'bg-[#1E1E1E] border-[#2A2A2A]'
                                    }
                                `}

                            >

                                <span className={`
                                    text-xs
                                    ${passado ? 'text-[#757575]' : 'text-[#A0A0A0]'}
                                `}>

                                    {diaSemanaNome[index].slice(0, 3)}

                                </span>


                                <span className={`
                                    text-lg
                                    ${passado 
                                        ? 'text-[#757575]' 
                                        : isHoje 
                                            ? 'text-[#D3AF37]' 
                                            : 'text-[#FFFFFF]'
                                    }
                                `}>

                                    {dia.getDate()}

                                </span>


                                {passado && (

                                    <span className="
                                        text-[9px]
                                        text-[#757575]
                                    ">

                                        indis.

                                    </span>

                                )}

                            </div>

                        )

                    }

                )}


            </div>


            {/* =====================================================
                HORÁRIOS
            ====================================================== */}

            <div className="
                flex
                flex-col
                gap-2
            ">


                {horarios.map(
                    (horario) => (

                        <div

                            key={horario.hora}

                            className="
                                grid
                                grid-cols-8
                                gap-2
                            "

                        >


                            {/* =============================================
                                HORA
                            ============================================== */}

                            <div className="
                                aspect-square
                                rounded-xl
                                bg-[#1E1E1E]
                                text-[#E0E0E0]
                                flex
                                items-center
                                justify-center
                                text-xs
                                font-medium
                                border
                                border-[#2A2A2A]
                            ">

                                {horario.hora}

                            </div>


                            {/* =============================================
                                DIAS
                            ============================================== */}

                            {diasSemana.map(
                                (dia) => {

                                    const passado =
                                        dataEstaNoPassado(dia)


                                    const ocupado =
                                        horarioEstaOcupado(
                                            dia,
                                            horario.hora
                                        )


                                    const indisponivel =
                                        passado ||
                                        ocupado


                                    return (

                                        <div

                                            key={`
                                                ${formatarData(dia)}-
                                                ${horario.hora}
                                            `}

                                            onClick={() => {

                                                if (
                                                    indisponivel
                                                ) {

                                                    return

                                                }


                                                selecionarHorarioDaSemana(
                                                    dia,
                                                    horario.hora
                                                )

                                            }}

                                            className={`
                                                aspect-square
                                                rounded-xl
                                                transition-all
                                                duration-200
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                gap-1
                                                border-2

                                                ${
                                                    passado

                                                        ? 'bg-[#333333] border-[#333333] cursor-not-allowed'

                                                        : ocupado

                                                            ? 'bg-[#333333] border-[#333333] cursor-not-allowed'

                                                            : 'bg-[#1E1E1E] border-[#2A2A2A] cursor-pointer hover:border-[#D3AF37] hover:bg-[#2A2A2A]'
                                                }
                                            `}

                                        >


                                            <span className={`
                                                text-[10px]
                                                font-medium

                                                ${
                                                    passado || ocupado
                                                        ? 'text-[#757575]'
                                                        : 'text-[#E0E0E0]'
                                                }
                                            `}>

                                                {passado
                                                    ? 'indis.'
                                                    : ocupado
                                                        ? 'ocupado'
                                                        : 'livre'
                                                }

                                            </span>


                                            <div
                                                className={`
                                                    w-[10px]
                                                    h-[10px]
                                                    rounded-full
                                                    transition-all
                                                    duration-200

                                                    ${
                                                        passado

                                                            ? 'bg-[#757575]'

                                                            : ocupado

                                                                ? 'bg-[#D3AF37]'

                                                                : 'bg-[#FFFFFF]'
                                                    }
                                                `}
                                            />


                                        </div>

                                    )

                                }

                            )}


                        </div>

                    )

                )}


            </div>


        </div>

    )

}