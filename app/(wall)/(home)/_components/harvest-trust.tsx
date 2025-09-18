import Image from "next/image"

export const HarvestBrandTrust = () => {
    return (
        <div className="h-full w-full">
            <div className="flex flex-col lg:flex-row justify-between gap-y-4 py-8 items-center w-full h-full min-h-[200px] lg:px-8">
                {/* Image Logo */}
                <div className="w-3/5 lg:w-2/5 justify-items-center relative">
                    <Image
                    src={'/Rasoraj-logo.png'}
                    alt="Rasoraj: Delta's Soul on Plate"
                    width={500}
                    height={500}
                    className="lg:absolute lg:-top-36"
                />
                </div>
                <div className="h-full w-full lg:w-3/5 px-4 lg:px-8 justify-items-center">
                    <p className="text-justify text-balance tracking-wide w-full lg:w-[75%]">
                        Bengal has all five tastes on the plate - sweet, salty, sour, bitter and umami. Under brand Rasoraj we are trying to serve the cultural palette, ingredients and cooked foods, to be enjoyed by the Bengalis world over and also could be tried by the Non-Bengalis as an adventure in their gastronomical trekking.
                    </p>
                </div>
            </div>
            <div className="w-full h-full flex justify-center items-center py-8 gap-x-4 lg:gap-x-16">
                <Image 
                    src={'/assets/trust-checkers.png'}
                    alt="Trust"
                    width={100}
                    height={100}
                />
                <Image 
                    src={'/assets/fssai.png'}
                    alt="Trust"
                    width={100}
                    height={100}
                />
                <Image 
                    src={'/assets/fda.png'}
                    alt="Trust"
                    width={100}
                    height={100}
                />
            </div>
        </div>
    )
}