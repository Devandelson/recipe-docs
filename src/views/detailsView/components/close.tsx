import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";


import { motion } from 'motion/react'

export default function View() {
    return (
        <motion.section className="w-75 bg-gray-100/50 max-md:hidden"
            // Key compuesta única usando Template Literals
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
            <article className="w-full min-h-150 max-h-full p-4 overflow-y-auto sticky top-0
            text-xl
            flex flex-col items-center justify-center text-center gap-2
            ">
                <FontAwesomeIcon icon={faUtensils} className="text-gray-300 text-3xl" />
                <p className="text-gray-400">No item selected</p>
                <p className="text-gray-600 text-sm">Pick a dish from the list to view it here</p>
            </article>
        </motion.section>
    )
}