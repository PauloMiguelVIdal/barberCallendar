'use client'

import { useState } from "react"
import Services from "./Services"
import { servicesType } from "../types/service"
import { X, CalendarCheck2 } from 'lucide-react'


type props = {
  horario: string

  fecharModal: () => void

  agendarHorario: (
    nome: string,
    telefone: string
  ) => void
}


export default function Formulario({
  horario,
  fecharModal,
  agendarHorario
}: props) {


  // =========================================================
  // SERVIÇOS
  // =========================================================

const [services, setServices] = useState<servicesType[]>([
  {
    checkbox: false,
    serviço: 'Corte social',
    price: 30
  },
  {
    checkbox: false,
    serviço: 'Degrade 0/1/2',
    price: 35
  },
  {
    checkbox: false,
    serviço: 'Navalhado',
    price: 40
  },
  {
    checkbox: false,
    serviço: 'Corte kids',
    price: 40
  },
  {
    checkbox: false,
    serviço: 'Corte tesoura',
    price: 45
  },
  {
    checkbox: false,
    serviço: 'Barba',
    price: 30
  },
  {
    checkbox: false,
    serviço: 'Sobrancelha',
    price: 10
  },
  {
    checkbox: false,
    serviço: 'Alisamento',
    price: 45
  },
  {
    checkbox: false,
    serviço: 'Luzes',
    price: 100
  },
  {
    checkbox: false,
    serviço: 'Platinado',
    price: 120
  },
  {
    checkbox: false,
    serviço: 'Pigmentação',
    price: 25
  },
  {
    checkbox: false,
    serviço: 'Tintura',
    price: 20
  }
])
  // =========================================================
  // DADOS DO CLIENTE
  // =========================================================

  const [nome, setNome] =
    useState<string>('')


  const [telefone, setTelefone] =
    useState<string>('')


  const [erroTelefone, setErroTelefone] =
    useState<string>('')


  // =========================================================
  // SELECIONAR SERVIÇO
  // =========================================================

  function selecionarServiços(index: number) {

    setServices((prev) =>

      prev.map((service, i) =>

        i === index

          ? {
              ...service,
              checkbox: !service.checkbox
            }

          : service

      )

    )

  }


  // =========================================================
  // CALCULAR TOTAL
  // =========================================================

  const somaFatu =

    services

      .filter(
        (serviço) =>
          serviço.checkbox
      )

      .reduce(
        (acc, serviço) =>
          acc + serviço.price,
        0
      )


  // =========================================================
  // FORMATAR TELEFONE
  // =========================================================

  function formatarTelefone(
    valor: string
  ) {

    /*
      Remove tudo que não for número.

      Exemplo:

      11 99999-9999

      vira:

      11999999999
    */

    const apenasNumeros =
      valor.replace(/\D/g, '')


    /*
      Limita o telefone a 11 números.

      Exemplo:

      1199999999999

      vira:

      11999999999
    */

    const numerosLimitados =
      apenasNumeros.slice(0, 11)


    /*
      Aplica a máscara:

      11
      ↓
      (11)

      11999
      ↓
      (11) 9999

      11999999999
      ↓
      (11) 99999-9999
    */

    if (
      numerosLimitados.length <= 2
    ) {

      return numerosLimitados
        ? `(${numerosLimitados}`
        : ''

    }


    if (
      numerosLimitados.length <= 7
    ) {

      return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2)}`

    }


    return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2, 7)}-${numerosLimitados.slice(7, 11)}`

  }


  // =========================================================
  // ALTERAR TELEFONE
  // =========================================================

  function handleTelefoneChange(
    valor: string
  ) {

    const telefoneFormatado =
      formatarTelefone(valor)


    setTelefone(
      telefoneFormatado
    )


    /*
      Enquanto o usuário digita,
      removemos a mensagem de erro.
    */

    setErroTelefone('')

  }


  // =========================================================
  // VALIDAR TELEFONE
  // =========================================================

  function telefoneValido(): boolean {

    /*
      Remove máscara.

      "(11) 99999-9999"

      vira:

      "11999999999"
    */

    const apenasNumeros =
      telefone.replace(/\D/g, '')


    /*
      Telefone celular brasileiro
      precisa ter 11 dígitos.

      Exemplo:

      11 + 9 + 99999999

      Total = 11 números
    */

    if (
      apenasNumeros.length !== 11
    ) {

      return false

    }


    /*
      O terceiro dígito precisa
      ser 9 para celulares.

      Exemplo válido:

      11999999999

      Exemplo inválido:

      11333333333
    */

    if (
      apenasNumeros[2] !== '9'
    ) {

      return false

    }


    return true

  }


  // =========================================================
  // CONFIRMAR AGENDAMENTO
  // =========================================================

  function confirmarAgendamento() {


    // -----------------------------------------
    // VALIDAR NOME
    // -----------------------------------------

    if (
      !nome.trim()
    ) {

      alert(
        'Digite seu nome para realizar o agendamento.'
      )

      return

    }


    // -----------------------------------------
    // VALIDAR TELEFONE
    // -----------------------------------------

    if (
      !telefoneValido()
    ) {

      setErroTelefone(
        'Digite um telefone celular válido. Exemplo: (11) 99999-9999'
      )

      return

    }


    // -----------------------------------------
    // VALIDAR SERVIÇO
    // -----------------------------------------

    if (
      somaFatu === 0
    ) {

      alert(
        'Selecione pelo menos um serviço.'
      )

      return

    }


    // -----------------------------------------
    // AGENDAR
    // -----------------------------------------

    agendarHorario(
      nome.trim(),
      telefone
    )

  }


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="
      w-full
      h-screen
      bg-black/80
      fixed
      top-0
      left-0
      z-[100]
      flex
      flex-col
      items-center
      justify-center
      p-4
    ">


      <div className="
        w-[90%]
        h-[80%]
        bg-white
        flex
        flex-col
        p-4
        gap-2
        rounded-xl
        items-center
        justify-between
      ">


        {/* =================================================
            BOTÃO FECHAR
        ================================================== */}

        <button

          className="
            bg-black
            flex
            items-center
            justify-center
            rounded-xl
            w-[35px]
            aspect-square
            absolute
            top-[10%]
            right-[5%]
          "

          onClick={
            fecharModal
          }

        >

          <X color="white" />

        </button>


        {/* =================================================
            DADOS DO CLIENTE
        ================================================== */}

        <div className="w-full">


          {/* NOME */}

          <input

            type="text"

            value={
              nome
            }

            className="
              text-black
              bg-black/30
              mt-3
              pl-[10px]
              w-full
              h-[40px]
              rounded-sm
              uppercase
            "

            onChange={
              (e) =>
                setNome(
                  e.target.value.toUpperCase()
                )
            }

            placeholder="NOME"

          />


          {/* TELEFONE */}

          <input

            type="tel"

            value={
              telefone
            }

            placeholder="(11) 99999-9999"

            className={`
              text-black
              bg-black/30
              mt-3
              pl-[10px]
              w-full
              h-[40px]
              rounded-sm

              ${
                erroTelefone
                  ? 'border-2 border-red-500'
                  : ''
              }
            `}

            onChange={
              (e) =>
                handleTelefoneChange(
                  e.target.value
                )
            }

            maxLength={15}

          />


          {/* ERRO DO TELEFONE */}

          {erroTelefone && (

            <p className="
              text-red-500
              text-xs
              mt-1
            ">

              {erroTelefone}

            </p>

          )}

        </div>


        {/* =================================================
            SERVIÇOS
        ================================================== */}

        <div className="
          bg-black
          w-full
          rounded-xl
          gap-4
        ">


          {services.map(
            (serviço, index) => (

              <Services

                key={
                  serviço.serviço
                }

                serviços={
                  serviço
                }

                onServices={
                  () =>
                    selecionarServiços(
                      index
                    )
                }

              />

            )
          )}


        </div>


        {/* =================================================
            RESUMO
        ================================================== */}

        <div className="
          w-[90%]
          flex
          justify-between
        ">


          <h2 className="
            text-black
          ">

            {horario}

          </h2>


          <h2 className="
            text-black
          ">

            Total R$: {somaFatu}

          </h2>


        </div>


        {/* =================================================
            CONFIRMAR
        ================================================== */}

        <div className="
          w-full
          rounded-xl
          bg-black
          flex
          items-center
        ">


          <button

            className="
              w-full
              p-4
              flex
              items-center
              justify-around
              rounded-xl
              text-white
            "

            onClick={
              confirmarAgendamento
            }

          >

            <CalendarCheck2 />

            <h2 className="
              font-bold
              text-center
            ">

              CONFIRMAR AGENDAMENTO

            </h2>

          </button>


        </div>


      </div>


    </div>

  )

}

