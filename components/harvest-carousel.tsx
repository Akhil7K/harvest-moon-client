'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import type { CarouselApi } from "./ui/carousel";

interface HarvestHeaderCarouselProps {
    onSlideChange: (slideIndex: number) => void;
}

const harvestCarouselItems = [
    {
        index: 1,
        src: '/assets/slide_image_1.png',
        alt: 'Slide 1',
        title: 'Bengali Niramish Mochar Ghonto',
        category: "Veg",
        categorySrc: '/assets/veg-sign.png'
    },
    {
        index: 2,  // Fixed unique index
        src: '/assets/slide_image_1.png',
        alt: 'Slide 2',
        title: 'Bengali Kochur Shak with Chola Narekel',
        category: "Veg",
        categorySrc: '/assets/veg-sign.png'
    },
    {
        index: 3,  // Fixed unique index
        src: '/assets/slide_image_1.png',
        alt: 'Slide 3',
        title: 'Bengali Kochur Shak with Chingri',
        category: "NonVeg",
        categorySrc: '/assets/nonveg-sign.png'
    },
    {
        index: 4,  // Fixed unique index
        src: '/assets/slide_image_1.png',
        alt: 'Slide 4',  // Fixed unique alt
        title: 'Tal Pulp',
        category: 'Veg',
        categorySrc: '/assets/veg-sign.png'
    },
]

export const HarvestHeaderCarousel = ({ onSlideChange }: HarvestHeaderCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const handleSelect = useCallback(() => {
        if (!api) return;
        const currentSlide = api.selectedScrollSnap();
        setCurrent(currentSlide);
        onSlideChange(currentSlide);
    }, [api, onSlideChange]);

    const scrollTo = useCallback((index: number) => {
        api?.scrollTo(index);
    }, [api]);

    useEffect(() => {
        if (!api) return;
        api.on("select", handleSelect);
        return () => {
            api.off("select", handleSelect);
        };
    }, [api, handleSelect]);

    return (
        <div className="flex flex-col items-center gap-y-4 w-full max-w-5xl mx-auto">
            <Carousel className="w-full" setApi={setApi} opts={{ 
                align: "center",
                loop: true
            }}>
                <CarouselContent>
                    {harvestCarouselItems.map((item) => (
                        <CarouselItem key={item.index}>
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="relative w-full h-44 lg:h-60">
                                    <Image 
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                    <Image 
                                        src={item.categorySrc}
                                        alt={item.src}
                                        width={25}
                                        height={25}
                                        className='absolute top-2 right-16 z-10'
                                    />
                                </div>
                                <h2 className="text-slate-700 text-xl mt-4 text-center">
                                    {item.title}
                                </h2>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            
            {/* Dot Navigation */}
            <div className="flex gap-3 items-center justify-center">
                {harvestCarouselItems.map((_, index) => (
                    <button
                        type='button'
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            current === index ? "bg-harvest-primary" : "bg-slate-300"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};