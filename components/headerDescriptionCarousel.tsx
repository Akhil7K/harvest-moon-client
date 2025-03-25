import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const headerDescriptions = [
    {
        index: 1,
        description: <div className="text-lg text-slate-800 tracking-wide"><p>Our products come in 2 categories:</p><p>&apos;Heat & Eat&apos; or Key &apos;Ingredient&apos;.</p><p>Best way to have authentic Delta Delicacies with least of efforts.</p></div>
    },
    {
        index: 2,
        description: <p className="text-lg text-slate-800 tracking-wide">We are very selective about the ingredients used in our products. The main vegetables are the best in their lines. The spices used are procured from healthy environments only.</p>
    },
    {
        index: 3,
        description: <p className="text-lg text-slate-800 tracking-wide">Benagli non-veg dishes are usually combined with vegetables of choice. Prawn and Taro is an age-old combo. The portion of the taro plant and the size of prawns are the catches.</p>
    },
    {
        index: 4,
        description: <p className="text-lg text-slate-800 tracking-wide">Kochur Loti (taro roots) is considered as a delicacy of Bengal. When combined with a coveted protein it creates a flavour that is mouth-watering.</p>
    }
] as const;

interface HeaderDescriptionCarouselProps {
    currentSlide: number;
}

export const HeaderDescriptionCarousel = ({ currentSlide }: HeaderDescriptionCarouselProps) => {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {headerDescriptions.map((item, index) => (
                    <CarouselItem 
                        key={item.index} 
                        className={`${currentSlide === index ? 'block' : 'hidden'}`}
                    >
                        <div className="md:max-w-96">
                            {item.description}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};