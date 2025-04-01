export const ProductSkeleton = ({ count = 4 }: { count?: number }) => {
    return (
        <>
            {Array(count).fill(0).map((_, i) => (
                <div 
                    key={i}
                    className="w-full aspect-square rounded-xl bg-slate-100 animate-pulse"
                />
            ))}
        </>
    );
};