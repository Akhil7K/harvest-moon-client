import { WhyDelta } from "./why-delta"
import { WhyDeltaDesciprtion } from "./why-delta-description"

export const DeltaSection = () => {
    return (
        <section className="h-full w-full">
            <div className="bg-harvest-delta">
                <div className="bg-delta-pattern">
                    <div className="bg-delta-map bg-contain bg-no-repeat flex items-center justify-between w-full">
                        <div className="w-2/5">
                            <WhyDelta />
                        </div>
                        <div className="w-3/5">
                            <WhyDeltaDesciprtion />
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    )
}