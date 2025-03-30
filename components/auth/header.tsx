interface HeaderProps {
    label: string
}

export const Header = ({label}:HeaderProps)=>{
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center text-2xl text-red-700">
            <p>
                {label}
            </p>
        </div>
    )
}