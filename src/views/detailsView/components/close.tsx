import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function View() {
    return (
        <section className="w-75 bg-gray-100/50 max-md:hidden">
            <article className="w-full min-h-150 max-h-full p-4 overflow-y-auto sticky top-0
            text-sm
            flex flex-col items-center justify-center text-center gap-2
            ">
                <FontAwesomeIcon icon={faUtensils} className="text-gray-300 text-xl" />
                <p className="text-gray-400">No item selected</p>
                <p className="text-gray-300 text-xs">Pick a dish from the list to view it here</p>
            </article>
        </section>
    )
}