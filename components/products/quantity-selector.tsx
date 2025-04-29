'use client'
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (newQuantity: number) => void
}

export const QuantitySelector = ({
    quantity,
    onQuantityChange,
}: QuantitySelectorProps) => {
    const handleIncrement = () => onQuantityChange(Math.min(quantity + 1, 5));
    const handleDecrement = () => onQuantityChange(Math.max(quantity - 1, 1));

    return (
        <div className="flex items-center justify-center gap-0">
            <Button
                variant={"outline"}
                className="h-10 w-10 p-0 font-bold text-xl border-2 border-slate-500 text-center rounded-r-none disabled:border-slate-500"
                size={"sm"}
                onClick={handleDecrement}
                disabled={quantity <= 1}
            >
                -
            </Button>
            <Input 
                type="number"
                min={1}
                max={5}
                value={quantity}
                onChange={(e) => {
                    const value = Math.max(1, Math.min(5, Number(e.target.value)));
                    onQuantityChange(value);
                }}
                className="w-16 text-center rounded-none h-10 border-y-2 border-slate-500 font-bold text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button 
                size={"sm"}
                variant={"outline"}
                className="h-10 w-10 p-0 font-boold text-xl border-2 border-slate-500 text-center rounded-l-none"
                onClick={handleIncrement}
                disabled= { quantity >= 5 }
            >
                +
            </Button>
        </div>
    );
}