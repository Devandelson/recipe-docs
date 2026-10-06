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
    infoView: ViewProps,
    setInfoView: React.Dispatch<React.SetStateAction<ViewProps>>,
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

export default function DetailView({ infoView, setInfoView }: ComponentView) {
    const [searchData, setSearchData] = useState<meal | null>(null);
    const { useRequest } = useProvider();

    useEffect(() => {
        if (infoView.stateView === 'closed' || !infoView.idMeal) {
            return;
        }

        const defaultInfo: meal | null = {
            idMeal: '',
            name: '',
            country: '',
            img: '',
            Instructions: '',
            ingredients: [''],
            stateView: infoView.stateView,
            category: '',
            typeInfo: 'local'
        };

        async function fetchMeal() {
            try {
                let mealData: any = null;

                if (infoView.typeInfo === 'local') {
                    mealData = localFetch(useRequest, infoView);
                } else {
                    const mealFetch = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${infoView.idMeal}`);
                    const resultJson = await mealFetch.json();
                    const mealBD = resultJson.meals?.[0];

                    if (!mealBD) {
                        setSearchData(defaultInfo)
                        return;
                    }

                    const stringIngredients: string[] = [];
                    for (let x = 1; x <= 20; x++) {
                        const key = `strIngredient${x}` as keyof typeof mealBD;
                        const ingredient = (mealBD[key] as string) ?? '';
                        if (ingredient.trim() !== '') {
                            stringIngredients.push(ingredient.trim());
                        }
                    }

                    mealData = {
                        idMeal: mealBD.idMeal,
                        name: mealBD.strMeal,
                        country: mealBD.strArea, // Note: TheMealDB uses strArea for country
                        img: mealBD.strMealThumb,
                        Instructions: mealBD.strInstructions,
                        ingredients: stringIngredients,
                        stateView: infoView.stateView,
                        category: mealBD.strCategory,
                        typeInfo: 'server'
                    };
                }

                if (infoView.stateView !== 'save') {
                    setSearchData(mealData);
                } else {
                    setSearchData(defaultInfo);
                }
            } catch (error) {
                setSearchData(defaultInfo);
            }
        }

        fetchMeal();
    }, [infoView.idMeal, infoView.stateView, infoView.typeInfo]);

    if (!infoView || infoView?.stateView === 'closed') return <Close></Close>;

    const renderView = () => {
        switch (searchData?.stateView) {
            case 'open':
                return (
                    <Data data={searchData} setInfoView={setInfoView} />
                );
            case 'edit':
                return (
                    <Edit data={searchData} setInfoView={setInfoView} />
                );
            case 'save':
                return (
                    <Save data={searchData} setInfoView={setInfoView} />
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence mode="wait" key={searchData?.stateView}>
            {renderView()}
        </AnimatePresence>
    );
}