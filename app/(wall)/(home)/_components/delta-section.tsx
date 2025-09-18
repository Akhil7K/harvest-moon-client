import { WhyDelta } from "./why-delta"
import { WhyDeltaDesciprtion } from "./why-delta-description"

export const DeltaSection = () => {
    return (
        <section className="h-full w-full">
            <div className="bg-harvest-delta">
                <div className="bg-delta-pattern">
                    <div className="bg-delta-map bg-contain bg-no-repeat flex flex-col lg:flex-row items-center justify-between w-full">
                        <div className="w-full lg:w-2/5 lg:bg-transparent bg-black/20">
                            <WhyDelta />
                        </div>
                        <div className="w-full lg:w-3/5">
                            <WhyDeltaDesciprtion />
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    )
}