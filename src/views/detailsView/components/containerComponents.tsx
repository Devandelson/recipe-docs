import { motion, AnimatePresence } from "motion/react";

// types
import { type meal } from "@/shared/context/dataContext";
import type { ViewProps } from "../dView";

export default function containerComponent({ children, setInfoView, data }: {
    children: React.ReactNode,
    setInfoView: React.Dispatch<React.SetStateAction<ViewProps>>,
    data: meal | null,
}) {
    return (
        <AnimatePresence mode="wait">
            {data && (
                <div className="h-[calc(100vh-8px)] relative p-2">
                    <section className="w-full max-w-90 h-full bg-gray-800 text-white max-md:fixed max-md:max-w-full max-md:top-0 max-md:left-0 z-30 max-md:h-screen rounded-lg p-2 relative scrollbar-none overflow-auto">
                        <button className="absolute bg-white text-black text-lg py-2 bottom-0
                        left-0 w-full z-20 cursor-pointer
                        hover:border-b-2 hover:border-gray-500
                        " onClick={() => setInfoView((prev) => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                stateView: 'closed'
                            };
                        })}>
                            Close details
                        </button>


                        <article className="w-full h-auto md:h-screen max-h-full overflow-y-auto scrollbar-none md:sticky top-0 text-sm p-3 sm:p-4 flex flex-col gap-3">
                            <motion.div
                                // Key compuesta única usando Template Literals
                                key={`${data.stateView}-${data.idMeal}`}
                                initial={{
                                    opacity: 0,
                                    y: -20,
                                    filter: 'blur(8px)'
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: 'blur(0px)'
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 20, // Cambiar a positivo al salir da un efecto visual de continuidad hacia abajo
                                    filter: 'blur(8px)'
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: 'easeInOut'
                                }}
                            >
                                {children}
                            </motion.div>
                        </article>
                    </section>
                </div>
            )}
        </AnimatePresence>
    );
}