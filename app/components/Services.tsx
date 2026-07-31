'use client'

import { Check } from 'lucide-react'
import { servicesType } from "../types/service"

type Props = {
    serviços: {
        checkbox: boolean
        serviço: string
        price: number
    }
    onServices: () => void
}

export default function Services({ serviços, onServices }: Props) {

    return (

        <button

            type="button"

            className={`
                w-full
                flex
                items-center
                justify-between
                p-3
                rounded-lg
                transition-all
                duration-200
                cursor-pointer
                border-2
                ${
                    serviços.checkbox

                        ? 'border-[#D3AF37] bg-[#2A2A2A]'

                        : 'border-[#333333] bg-[#1E1E1E] hover:border-[#757575]'
                }
            `}

            onClick={
                onServices
            }

        >

            <div className="
                flex
                items-center
                gap-3
            ">

                {/* =================================================
                    CHECKBOX PERSONALIZADO
                ================================================= */}

                <div className={`
                    w-[22px]
                    h-[22px]
                    rounded-md
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-200
                    border-2
                    flex-shrink-0
                    ${
                        serviços.checkbox

                            ? 'bg-[#D3AF37] border-[#D3AF37]'

                            : 'bg-[#333333] border-[#757575]'
                    }
                `}>

                    {serviços.checkbox && (

                        <Check
                            size={16}
                            className="text-[#121212]"
                            strokeWidth={3}
                        />

                    )}

                </div>

                {/* =================================================
                    NOME DO SERVIÇO
                ================================================= */}

                <span className={`
                    text-sm
                    font-medium
                    ${
                        serviços.checkbox

                            ? 'text-[#FFFFFF]'

                            : 'text-[#E0E0E0]'
                    }
                `}>

                    {serviços.serviço}

                </span>

            </div>

            {/* =================================================
                PREÇO
            ================================================= */}

            <span className={`
                text-sm
                font-semibold
                ${
                    serviços.checkbox

                        ? 'text-[#D3AF37]'

                        : 'text-[#A0A0A0]'
                }
            `}>

                R${serviços.price}

            </span>

        </button>

    )
}