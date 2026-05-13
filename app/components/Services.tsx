'use client'

type Props = {
    serviços: {
        checkbox: boolean
        serviço: string
        price: number

    }
}






export default function Services({ serviços }: Props) {

// function atualizarAgendamento(){
// setServices((serviços)=>{serviços.checkbox:true})
// }


    return (

        <div className="flex items-center w-full h-[40px] bg-black rounded-sm justify-between">
            <div className="w-full flex">
                <input checked={serviços.checkbox} className="h-[32px] ml-[4px] rounded-xl self-center aspect-square" type="checkbox" />
                <h2 className="ml-4 text-2xl">{serviços.serviço}</h2>
            </div>
            <div>
                <h2 className="mr-4 text-2xl">{serviços.price}</h2>
            </div>
        </div>

    )
} 