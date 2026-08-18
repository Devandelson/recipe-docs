// shared
import { useProvider } from '@/shared/context/dataContext.tsx';

// types
import { type infoRequest } from '@/shared/context/dataContext.tsx';
import { useState } from 'react';

export default function Header() {
    const { useRequest, setUserRequest } = useProvider();
    const [existCategories, setExistCategories] = useState<string[]>([useRequest?.selectCategory ?? '']);

    async function handleCategory(
        setUserRequest: React.Dispatch<React.SetStateAction<infoRequest | null>>,
        existCategories: string[],
        setExistCategories: React.Dispatch<React.SetStateAction<string[]>>,
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        const value = e.target.value;
        if (!value) return;

        const isCategoryFetched = existCategories.includes(value);

        if (isCategoryFetched) {
            // Si ya existe, solo cambia la categoría activa conservando el estado anterior
            setUserRequest((prev: infoRequest | null) => {
                if (!prev) return null;
                return {
                    ...prev,
                    selectCategory: value
                };
            });
        } else {
            // Si no existe en caché, hace el fetch y acumula los datos
            const mealsFetch = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`);
            const dataFetchM = await mealsFetch.json();

            if (!dataFetchM.meals) return;

            const resultM: infoRequest['meals'] = dataFetchM.meals.map((meal: any) => ({
                idMeal: meal.idMeal,
                name: meal.strMeal,
                country: '',
                img: meal.strMealThumb,
                Instructions: '',
                ingredients: [''],
                category: value,
                typeInfo: 'server' as const
            }));

            setUserRequest((prev: infoRequest | null) => ({
                categories: prev?.categories ?? [],
                selectCategory: value,
                meals: [...resultM, ...(prev?.meals ?? [])]
            }));

            setExistCategories((prev) => [value, ...prev]);
        }
    }

    return (
        <select
            value={useRequest?.selectCategory ?? ''}
            onChange={(e) => handleCategory(setUserRequest, existCategories, setExistCategories, e)}
            className='w-full p-2 bg-gray-300 rounded-bl-sm rounded-br-sm'
        >
            <option value="" disabled>Selecciona una categoría</option>
            {useRequest?.categories.map((item) => (
                <option key={item.name} value={item.name}>
                    {item.name}
                </option>
            ))}
        </select>
    );
}