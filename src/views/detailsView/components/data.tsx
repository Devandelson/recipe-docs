// type
import { type meal } from '@/shared/context/dataContext.tsx';

// componet
import ContainerComponent from './containerComponents.tsx';

export default function View({ data, setSearchData }: {
    data: meal | null,
    setSearchData: React.Dispatch<React.SetStateAction<meal | null>>
}) {
    return (
        <ContainerComponent setSearchData={setSearchData} data={data}>
            <h2 className="font-bold text-2xl text-center">View active item</h2>

            <img src={data?.img} className='w-full h-50 rounded-lg object-cover mt-2 mb-2' />
            <b>Details: </b>
            <div className='flex items-start flex-col gap-2'>
                <p>{data?.Instructions}</p>
            </div>

            <h3 className='text-xl font-bold mt-2 mb-1'>Ingredients: </h3>
            <ul className='flex items-center flex-wrap gap-3'>
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