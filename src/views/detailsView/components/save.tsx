// Resources
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// hooks
import React, { useState, type ChangeEvent } from 'react';

// types
import { type meal } from '@/shared/context/dataContext.tsx';
import { type infoRequest } from '@/shared/context/dataContext.tsx';
import type { ViewProps } from "../dView";

// shared
import { useProvider } from '@/shared/context/dataContext.tsx';
import { Toast } from '@/shared/customPopup.tsx';

// componet
import ContainerComponent from './containerComponents.tsx';

export default function SaveView({ setInfoView, data }: {
    setInfoView: React.Dispatch<React.SetStateAction<ViewProps>>,
    data: meal | null
}) {
    const { useRequest, setUserRequest } = useProvider();
    const idMealDB = String(useRequest?.meals.length ?? 0);
    const selectCategory = useRequest?.selectCategory;

    const [infoF, setInfoF] = useState<meal>({
        idMeal: idMealDB,
        name: '',
        country: '',
        img: '',
        Instructions: '',
        ingredients: [''],
        typeInfo: 'local',
        category: selectCategory ?? ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInfoF(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const ingredientsArray = e.target.value.split(',').map(item => item.trimStart());
        setInfoF(prev => ({
            ...prev,
            ingredients: ingredientsArray
        }));
    };

    function saveInfo(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (infoF.Instructions == '' || infoF.category == '' || infoF.country == '' || infoF.idMeal == '' || infoF.ingredients.length < 1 || infoF.name == '') {
            Toast.fire({
                icon: 'error',
                title: 'Please, complete all the information in the formulary.'
            });
            return;
        }

        setUserRequest((prev: infoRequest | null) => {
            const copyPrev = {
                ...prev,
                categories: [...prev?.categories ?? []],
                meals: [...prev?.meals ?? []],
                selectCategory: prev?.selectCategory ?? ''
            };

            const extraArray = copyPrev.meals;
            const newArray: infoRequest['meals'] = [infoF, ...extraArray];
            copyPrev.meals = newArray;
            return copyPrev;
        });

        setInfoView((prev => ({
            ...prev,
            stateView: 'closed'
        })));

        Toast.fire({
            icon: 'success',
            title: 'Information saved successfully!'
        });
    }

    return (
        <ContainerComponent setInfoView={setInfoView} data={data}>
            <h2 className="font-bold text-xl sm:text-2xl text-center">Creating New Meal</h2>

            <ControlImg preview={infoF.img} setInfoF={setInfoF} />

            <section className='w-full h-auto flex flex-col gap-3 mt-2 mb-2'>
                {/* Nombre del plato */}
                <div className='w-full flex flex-col items-start'>
                    <b className='text-lg'>Name:</b>
                    <input
                        type="text"
                        name="name"
                        value={infoF.name}
                        onChange={handleChange}
                        placeholder='Nombre del platillo...'
                        className='w-full bg-gray-200/30 p-2 rounded-sm'
                    />
                </div>

                {/* País de origen */}
                <div className='w-full flex flex-col items-start'>
                    <b className='text-lg'>Country:</b>
                    <input
                        type="text"
                        name="country"
                        value={infoF.country}
                        onChange={handleChange}
                        placeholder='País de origen...'
                        className='w-full bg-gray-200/30 p-2 rounded-sm'
                    />
                </div>

                {/* URL de la Imagen */}
                <div className='w-full flex flex-col items-start'>
                    <b className='text-lg'>URL image:</b>
                    <input
                        type="text"
                        name="img"
                        value={infoF.img}
                        onChange={handleChange}
                        placeholder='https://enlace-de-imagen.com...'
                        className='w-full bg-gray-200/30 p-2 rounded-sm'
                    />
                </div>

                {/* Instrucciones / Detalles */}
                <div className='w-full h-auto flex flex-col items-start'>
                    <b className='text-lg'>Instructions:</b>
                    <textarea
                        name="Instructions"
                        value={infoF.Instructions}
                        onChange={handleChange}
                        placeholder='Da detalles sobre la preparación del platillo...'
                        className='w-full min-h-37.5 resize-none bg-gray-200/30 p-2 rounded-sm h-24'
                    />
                </div>

                {/* Ingredientes */}
                <div className='w-full flex flex-col items-start'>
                    <b className='text-lg'>Ingredients:</b>
                    <textarea
                        value={infoF.ingredients.join(', ')}
                        onChange={handleIngredientsChange}
                        placeholder='Da detalles sobre los ingredientes...'
                        className='w-full resize-none bg-gray-200/30 p-2 rounded-sm h-20'
                    />
                    <p className="text-[14px] mt-1 text-orange-400"><b>Note:</b> Divide the ingredients by comas (,).</p>
                </div>
            </section>

            <button className="text-sm p-3 w-full bg-blue-400 text-white rounded-sm hover:bg-blue-500 hover:shadow-2xl/50 hover:shadow-blue-900 transition-all cursor-pointer hover:scale-105 active:scale-100 mt-4 mb-10"
                onClick={(e) => { saveInfo(e) }}
            >
                Create Meal
            </button>
        </ContainerComponent>
    );
}

const MAX_SIZE_MB = 3;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function ControlImg({ preview, setInfoF }: {
    preview: string | null,
    setInfoF: React.Dispatch<React.SetStateAction<meal>>,
}) {
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size
        if (file.size > MAX_SIZE_BYTES) {
            Toast.fire({
                icon: 'error',
                title: `File is too large. Max size is ${MAX_SIZE_MB}MB.`
            });

            setInfoF((prev) => ({ ...prev, img: '' }));
            e.target.value = ''; // reset the input so the same file can be reselected
            return;
        }

        // Validate it's actually an image
        if (!file.type.startsWith('image/')) {
            Toast.fire({
                icon: 'error',
                title: `Please select an image file.`
            });
            setInfoF((prev) => ({ ...prev, img: '' }));
            e.target.value = '';
            return;
        }

        setError(null);
        // Create a temporary local URL to preview the image before upload
        const objectUrl = URL.createObjectURL(file);
        setInfoF((prev) => ({ ...prev, img: objectUrl }));
    };

    return (
        <label
            className="w-full h-50 relative rounded-lg bg-gray-200 flex items-center flex-col gap-1 text-center justify-center mt-2 mb-2 border-2 border-transparent border-dashed
      transition-all cursor-pointer p-2
      hover:bg-gray-400 hover:border-gray-800 group
      overflow-hidden"
            htmlFor="photo"
        >
            <input
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 hidden"
                id="photo"
                onChange={handleFileChange}
            />

            {preview ? (
                // Show the selected image instead of the placeholder icon/text
                <img
                    src={preview}
                    alt="Selected preview"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <>
                    <p className="text-xl text-gray-800 group-hover:text-white group-hover:scale-110 transition-all">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </p>
                    <p className="text-sm text-gray-700 group-hover:text-white group-hover:scale-110 transition-all">
                        Notes: Max size ({MAX_SIZE_MB}MB)
                    </p>
                </>
            )}

            {error && (
                <p className="absolute bottom-1 text-xs text-red-600 bg-white/80 px-2 rounded">
                    {error}
                </p>
            )}
        </label>
    );
}