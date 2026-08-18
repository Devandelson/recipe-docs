// import bg from '@/assets/Background.png';
// Resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';
import recipe from '@/assets/recipe.png';
import { motion } from 'motion/react';

// types
import { type meal, type infoRequest } from '@/shared/context/dataContext.tsx';
import { type ViewProps } from '../detailsView/dView.tsx'

// shared
import { useProvider } from '@/shared/context/dataContext.tsx';

// components
import Header from '../header.tsx'
import { useEffect, useState } from 'react';

interface ComponentRecipe {
    setInfoView: React.Dispatch<React.SetStateAction<ViewProps>>
};

export default function Recipes({ setInfoView }: ComponentRecipe) {
    const { useRequest } = useProvider();
    const selectCategory = String(useRequest?.selectCategory).trim();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!useRequest?.meals) return;
        function runLoad() {
            setLoading(true);
        };
        runLoad();
    }, [useRequest])

    function handleView(e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLSpanElement>) {
        e.preventDefault();

        setInfoView((prev: ViewProps) => {
            const copyPrev = { ...prev };
            copyPrev.idMeal = String(parseInt(copyPrev.idMeal) + 1);
            copyPrev.stateView = 'save';
            copyPrev.typeInfo = 'local'
            return copyPrev;
        });
    }

    const waitMessage = (
        <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 text-neutral-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-xs">Loading recipes…</p>
        </div>
    );

    return (
        <motion.section className='p-4 h-screen grid grid-rows-[auto_auto_auto_auto_1fr]'
            initial={{
                y: -15,
                opacity: 0
            }}

            animate={{
                y: 0,
                opacity: 1
            }}

            exit={{
                y: -15,
                opacity: 0
            }}
        >
            <div className='flex items-center gap-4  '>
                <img src={recipe} />
                <div>
                    <h1 className="font-bold text-3xl">Recipes Docs</h1>
                    <p className="text-xl text-gray-700">Explore recipes from every corner of the globe, master new techniques, and bring exciting flavors to your table</p>
                </div>
            </div>


            <button className="text-sm p-2 bg-blue-300 text-white rounded-sm mt-3 hover:bg-blue-500 hover:shadow-2xl/50 hover:shadow-blue-900 transition-all cursor-pointer hover:scale-[1.02] active:scale-100 -mb-1"
                onClick={(e) => { handleView(e) }} >Create your own recipe</button>
            <Header></Header>

            <div className='w-full overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 scrollbar-thumb-sky-700 scrollbar-track-sky-100 pr-1.5'>
                {
                    loading == false ? (waitMessage) :
                        (useRequest?.meals.length ?? 0 > 0) ? (
                            useRequest?.meals.map((item, index) => (
                                item.category == selectCategory &&
                                (<RecipeItem key={index} img={item.img} country={item.country} name={item.name} setInfoView={setInfoView} typeInfo={item.typeInfo} idMeal={item.idMeal}></RecipeItem>)
                            ))
                        ) :
                        (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-lg text-red-700 dark:bg-red-950/50 dark:text-red-400 h-max mt-3 w-full ">
                                <p><span className="font-medium text-red-900 dark:text-red-300 ">Connection Error:</span> The service isn't responding. Try again or contact your administrator.</p>
                            </div>
                        )
                }
            </div>
        </motion.section>
    )
}

function RecipeItem({ name, img, country, setInfoView, idMeal, typeInfo }:
    Pick<meal, 'name' | 'img' | 'country' | 'idMeal' | 'typeInfo'>
    & ComponentRecipe) {

    const { setUserRequest } = useProvider();

    function SelectItem(idMealP: string, e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLSpanElement>,
        type: 'closed' | 'open' | 'save' | 'edit',
        typeInfo: 'server' | 'local'
    ) {
        e.preventDefault();

        setInfoView((prev: ViewProps) => {
            const copyPrev = { ...prev };
            copyPrev.idMeal = idMealP;
            copyPrev.stateView = type;
            copyPrev.typeInfo = typeInfo
            return copyPrev;
        });
    }

    function handleDelete(e: React.MouseEvent<HTMLSpanElement>, idMeal: string) {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure about delete this item ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setUserRequest((prev: infoRequest | null) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        meals: prev.meals?.filter((meal) => meal.idMeal !== idMeal) ?? []
                    };
                });

                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                })
            }
        });
    }

    return (
        <motion.div className="relative flex-col rounded-xl text-gray-700 bg-transparent p-4
        grid grid-rows-[auto_1fr_auto] transition-all group hover:scale-[1.02]
        "
            initial={{
                x: -15,
                opacity: 0
            }}

            animate={{
                x: 0,
                opacity: 1
            }}

            exit={{
                x: -15,
                opacity: 0
            }}
        >
            <span className='w-full h-[80%] block top-[20%] left-0 bg-white -z-10 shadow-md absolute rounded-xl group-hover:shadow-2xl transition-all'></span>
            <span className='absolute p-1 px-3 rounded-3xl text-center top-7 left-7 z-10 bg-orange-200 text-sm'>From {country}</span>

            {/* Controls */}
            <span className='absolute p-2 px-2.5 rounded-full text-center top-33 left-7 z-10 bg-red-200 text-sm'
                onClick={(e) => { handleDelete(e, idMeal) }}
            ><FontAwesomeIcon icon={faTrashCan} /></span>

            <span className='absolute p-2 px-2.5 rounded-full text-center top-33 left-18 z-10 bg-blue-200 text-sm' onClick={(e) => { SelectItem(idMeal, e, 'edit', typeInfo) }}><FontAwesomeIcon icon={faEdit} /></span>

            <img src={img} className='w-full h-40.5 object-cover m-auto rounded-xl
            group-hover:scale-105 transition-all
            ' loading='lazy' />

            <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased mt-2 text-center">
                {name}
            </h5>

            <button className="text-sm p-2 bg-blue-300 text-white rounded-sm mt-1 hover:bg-blue-500 hover:shadow-2xl/50 hover:shadow-blue-900 transition-all cursor-pointer hover:scale-105 active:scale-100"
                onClick={(e) => { SelectItem(idMeal, e, 'open', typeInfo) }}
            >View more...</button>
        </motion.div>
    )
}