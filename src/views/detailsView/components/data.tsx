// type
import { type meal } from '@/shared/context/dataContext.tsx';

// componet
import ContainerComponent from './containerComponents.tsx';
import type { ViewProps } from "../dView";

export default function View({ data, setInfoView }: {
    data: meal | null,
    setInfoView: React.Dispatch<React.SetStateAction<ViewProps>>,
}) {
    return (
        <ContainerComponent setInfoView={setInfoView} data={data}>
            <h2 className="font-bold text-2xl text-center">Details of {data?.name}</h2>

            <img src={data?.img} className='w-full h-50 rounded-lg object-cover mt-2 mb-2' />
            <b className="text-lg">Instructions: </b>
            <div className='flex items-start flex-col gap-2 max-h-[350px] overflow-y-auto scrollbar-thin pr-2'>
                <p>{data?.Instructions}</p>
            </div>

            <h3 className='text-lg font-bold mt-2 mb-1'>Ingredients: </h3>
            <ul className='flex items-center flex-wrap gap-3 mb-8'>
                {
                    data?.ingredients.map((item, index) => (
                        <li key={index} className='px-4 py-1 rounded-3xl bg-amber-950 text-white'>
                            {item}
                        </li>
                    ))
                }
            </ul>
        </ContainerComponent>
    )
}