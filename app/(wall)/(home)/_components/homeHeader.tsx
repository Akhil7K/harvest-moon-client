'use client';

import { useState } from 'react';
import { HarvestHeaderCarousel } from "@/components/harvest-carousel";
import { HeaderDescriptionCarousel } from '@/components/headerDescriptionCarousel';

export const HomeHeader = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <div className="bg-gradient-to-r from-white from-40% to-[#e6e7d2] w-full">
            <div className="flex flex-col md:flex-row justify-between items-center py-16 w-full px-8 bg-hero-pattern bg-contain bg-center">
                <div className="w-full flex flex-col justify-around gap-y-2">
                    <p className="text-3xl md:text-4xl text-slate-500 font-light tracking-wide">Authentic Cuisines</p>
                    <p className="text-5xl md:text-8xl text-harvest-primary">of Bengal</p>
                    <p className="text-3xl md:text-4xl text-slate-500 font-light pt-4 tracking-wide">Served on Your Table</p>
                    <div className="pt-4">
                        <HeaderDescriptionCarousel currentSlide={currentSlide} />
                    </div>
                </div>
                <div className="w-full">
                    <HarvestHeaderCarousel onSlideChange={setCurrentSlide} />
                </div>
            </div>
        </div>
        
    );
};