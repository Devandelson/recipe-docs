import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "motion/react";

// types
import { type meal } from "@/shared/context/dataContext";

export default function containerComponent({ children, setSearchData, data }: {
    children: React.ReactNode,
    setSearchData: React.Dispatch<React.SetStateAction<meal | null>>,
    data: meal | null,
}) {
    return (
        <AnimatePresence mode="wait">
            {data && (
                <section className="w-full max-w-75 h-auto overflow-y-auto bg-gray-800 text-white max-md:fixed max-md:max-w-full max-md:top-0 max-md:left-0 z-30 max-md:h-screen">
                    <FontAwesomeIcon
                        icon={faSquareXmark}
                        className="hidden absolute text-white text-3xl bottom-3 left-3 z-20 max-md:block cursor-pointer"
                        onClick={() => setSearchData(null)}
                    />

                    <article className="w-full h-auto md:h-screen max-h-full overflow-y-auto md:sticky top-0 text-sm p-3 sm:p-4 flex flex-col gap-3">
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
            )}
        </AnimatePresence>
    );
}