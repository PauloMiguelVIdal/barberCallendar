'use client'

import {
    CalendarCheck,
    Clock,
    Scissors,
    UserRound,
    Phone,
    ArrowLeft
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
        setInterfaceView
    } = useCentralDados()


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
                text-black
            ">

                <div className="
                    w-[80px]
                    aspect-square
                    rounded-full
                    bg-black
                    flex
                    items-center
                    justify-center
                ">

                    <CalendarCheck
                        color="white"
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
                    ">

                        Nenhum agendamento

                    </h2>


                    <p className="
                        text-sm
                        text-zinc-500
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
                        bg-black
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        flex
                        items-center
                        gap-2
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
            text-black
        ">


            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
            ">


                <div className="
                    flex
                    flex-col
                    gap-1
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                    ">

                        Meus agendamentos

                    </h1>


                    <p className="
                        text-sm
                        text-zinc-500
                    ">

                        Horários reservados neste dispositivo

                    </p>

                </div>


                <CalendarCheck
                    size={30}
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
                                bg-white
                                border
                                border-zinc-200
                                rounded-2xl
                                p-5
                                flex
                                flex-col
                                gap-4
                                shadow-sm
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
                                        bg-black
                                        flex
                                        items-center
                                        justify-center
                                    ">

                                        <CalendarCheck
                                            color="white"
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
                                        ">

                                            {formatarData(
                                                agendamento.data
                                            )}

                                        </span>


                                        <span className="
                                            text-sm
                                            text-zinc-500
                                            flex
                                            items-center
                                            gap-1
                                        ">

                                            <Clock
                                                size={14}
                                            />

                                            {agendamento.hora}

                                        </span>

                                    </div>

                                </div>


                                <span className="
                                    bg-green-100
                                    text-green-700
                                    text-xs
                                    font-bold
                                    px-3
                                    py-1
                                    rounded-full
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
                                bg-zinc-200
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
                                ">

                                    <UserRound
                                        size={17}
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
                                ">

                                    <Phone
                                        size={17}
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
                                bg-zinc-100
                                rounded-xl
                                p-3
                            ">


                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                ">

                                    <Scissors
                                        size={17}
                                    />

                                    <span>
                                        Duração estimada
                                    </span>

                                </div>


                                <strong>

                                    {agendamento.duracao ?? 0} min

                                </strong>

                            </div>


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
                    bg-black
                    text-white
                    p-4
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    gap-2
                    font-bold
                "

            >

                <ArrowLeft
                    size={20}
                />

                Voltar para o calendário

            </button>


        </div>

    )

}