function App() {
  return (
    <div className="w-full h-auto min-h-screen grid grid-cols-1 relative bg-[#D7F2FF]">
      <BackElements></BackElements>
      <GroupContainer></GroupContainer>
    </div>
  )
}

function BackElements() {
  return (
    <section className="w-full h-screen fixed top-0 left-0 z-0">
      <span className="block w-3/12 aspect-square absolute -top-1/12 -left-1/12 rounded-full bg-blue-600 z-10 blur-3xl"></span>
      <span className="block w-3/12 aspect-square absolute -bottom-1/12 -right-1/12 rounded-full bg-blue-600 z-10 blur-3xl"></span>
    </section>
  )
}

// Views
import Recipes from "./views/recipeDetails/recipes.tsx";
import DetailsView from "./views/detailsView/dView.tsx";

// Shared
import { DataProvider } from '@/shared/context/dataContext.tsx';
import { useState } from "react";

// types
import { type ViewProps } from './views/detailsView/dView.tsx';

function GroupContainer() {
  const [infoView, setInfoView] = useState<ViewProps>({
    idMeal: '',
    stateView: 'closed',
    typeInfo: 'server'
  });

  return (
    <div className="w-full relative h-screen rounded-sm z-10 bg-white/30 backdrop-blur-2xl">
      <DataProvider>
        <main className="w-full h-screen relative grid grid-cols-[1fr_auto]">
          <Recipes setInfoView={setInfoView} />
          <DetailsView infoView={infoView} />
        </main>
      </DataProvider>
    </div>
  )
}

export default App;