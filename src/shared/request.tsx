import { type infoRequest, type meal } from './context/dataContext.tsx';

export async function RequestData(): Promise<infoRequest> {
    const categoryFetch = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list', {
        method: 'GET'
    });
    const dataFetchC = await categoryFetch.json();
    const resultC: infoRequest['categories'] = dataFetchC.meals.map((cMeal) => {
        return {
            name: cMeal.strCategory
        }
    });
    const selectMEal = resultC?.[0].name.trim();
    const mealsFetch = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectMEal}`, {
        method: 'GET'
    });
    const dataFetchM = await mealsFetch.json();

    const resultM: infoRequest['meals'] = dataFetchM.meals.map((meal): meal => {  
        return {
            idMeal: meal.idMeal,
            name: meal.strMeal,
            country: meal.strArea, // La API usa 'strArea' para el país/región
            img: meal.strMealThumb,
            Instructions: '',
            ingredients: [''],
            category: selectMEal,
            typeInfo: 'server'
        };
    });
    
    return {
        'categories': resultC,
        'meals': resultM,
        'selectCategory': selectMEal
    }
};