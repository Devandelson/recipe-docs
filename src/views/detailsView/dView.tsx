// Resources
import { AnimatePresence } from 'motion/react';

// components
import Edit from './components/edit.tsx';
import Data from './components/data.tsx';
import Save from './components/save.tsx';
import Close from './components/close.tsx';

// types
export interface ViewProps {
    idMeal: string;
    stateView: 'closed' | 'open' | 'save' | 'edit',
    typeInfo: 'server' | 'local'
};
import { type meal, useProvider, type infoRequest } from '@/shared/context/dataContext.tsx';
import { useState, useEffect } from 'react';

interface ComponentView {
    infoView: ViewProps
};

function localFetch(useRequest: infoRequest | null, infoView: ViewProps): any {
    const rawMeal = useRequest?.meals.find((m) => m.idMeal === infoView.idMeal);

    if (!rawMeal) return null;

    return {
        idMeal: rawMeal.idMeal,
        name: rawMeal.name,
        country: rawMeal.country,
        img: rawMeal.img,
        Instructions: rawMeal.Instructions,
        ingredients: rawMeal.ingredients,
        category: rawMeal.category,
        stateView: infoView.stateView,
        typeInfo: 'server'
    };
}

export default function DetailView({ infoView }: ComponentView) {
    const [searchData, setSearchData] = useState<meal | null>(null);
    const { useRequest } = useProvider();

    useEffect(() => {
        // Evita ejecutar la petición si la vista está cerrada o no hay ID
        if (infoView.stateView === 'closed' || !infoView.idMeal) return;

        let isMounted = true;
        const defaultInfo: meal | null = {
            idMeal: '',
            name: '',
            country: '',
            img: '',
            Instructions: '',
            ingredients: [''],
            stateView: infoView.stateView, // Dynamically match infoView state
            category: '',
            typeInfo: 'local'
        };

        async function fetchMeal() {
            try {
                let meal: any = null;

                if (infoView.typeInfo == 'local') {
                    meal = localFetch(useRequest, infoView);
                } else {
                    const mealFetch = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${infoView.idMeal}`);
                    const resultJson = await mealFetch.json();
                    const mealBD = resultJson.meals[0];

                    const stringIngredients: string[] = [];

                    for (let x = 1; x <= 20; x++) {
                        const key = `strIngredient${x}` as keyof typeof mealBD;
                        const ingredient = (mealBD[key] as string) ?? '';

                        if (ingredient.trim() !== '') {
                            stringIngredients.push(ingredient.trim());
                        }
                    }

                    meal = {
                        idMeal: mealBD.idMeal,
                        name: mealBD.strMeal,
                        country: mealBD.strCountry,
                        img: mealBD.strMealThumb,
                        Instructions: mealBD.strInstructions,
                        ingredients: stringIngredients,
                        stateView: infoView.stateView,
                        category: mealBD.strCategory,
                        typeInfo: 'server'
                    }
                }

                if (isMounted) {
                    if (infoView.stateView != 'save') {
                        setSearchData(meal);
                    } else {
                        setSearchData(defaultInfo);
                    }
                };
            } catch (error) {
                if (isMounted) {
                    setSearchData(defaultInfo);
                }
            }
        }

        fetchMeal();
        return () => {
            isMounted = false;
        };
    }, [infoView.idMeal, infoView.stateView]);

    if (!searchData) return <Close></Close>;

    const renderView = () => {
        switch (searchData?.stateView) {
            case 'open':
                return (
                    <Data data={searchData} setSearchData={setSearchData} />
                );
            case 'edit':
                return (
                    <Edit data={searchData} setSearchData={setSearchData} />
                );
            case 'save':
                return (
                    <Save data={searchData} setSearchData={setSearchData} />
                );
            default: return (<Close />);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {renderView()}
        </AnimatePresence>
    );
}