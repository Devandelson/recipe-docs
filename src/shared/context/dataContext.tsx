import { useContext, createContext, useState, useEffect } from "react";
import { RequestData } from "../request.tsx";

interface category {
    name: string
}

export interface meal {
    idMeal: string
    name: string
    country: string
    img: string
    Instructions: string,
    ingredients: string[],
    category: string,
    stateView?: 'closed' | 'open' | 'save' | 'edit',
    typeInfo: 'server' | 'local'
}

export interface infoRequest {
    categories: category[];
    meals: meal[];
    selectCategory: string
}

interface providerProps {
    useRequest: infoRequest | null;
    setUserRequest: React.Dispatch<React.SetStateAction<infoRequest | null>>
}

const dataContext = createContext<providerProps | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [useRequest, setUserRequest] = useState<infoRequest | null>(null);

    useEffect(() => {
        async function makingRequest() {
            const result: infoRequest = await RequestData();
            setUserRequest(result);
        }

        makingRequest();
    }, [])

    return (
        <dataContext.Provider value={{
            useRequest: useRequest,
            setUserRequest: setUserRequest
        }}>
            {children}
        </dataContext.Provider>
    )
}

export function useProvider() {
    const providerData = useContext(dataContext);
    if (!providerData) {
        throw 'you need to put DataProvider.'
    };
    return providerData;
}