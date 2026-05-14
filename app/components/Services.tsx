'use client'
import { servicesType } from "../types/service"

type Props = {
    serviços: {
        checkbox: boolean
        serviço: string
        price: number

    }
    onServices: () => void

}




export default function Services({ serviços,onServices}: Props) {




    return (

        <div className="flex items-center w-full h-[40px] bg-white/40 rounded-sm justify-between  mt-[4px]">
            <div className="w-full flex">
                <input checked={serviços.checkbox} onChange={onServices} className="h-[32px] ml-[4px] rounded-xl self-center aspect-square" type="checkbox" />
                <h2 className="ml-4 text-2xl">{serviços.serviço}</h2>
            </div>
            <div className="flex">
                <h2 className="mr-4 text-2xl">R${serviços.price}</h2>
            </div>
        </div>

    )
} 