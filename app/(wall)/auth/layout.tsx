const AuthLayout = ({children}:{children: React.ReactNode}) =>{
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-700/80 from-[10%] to-red-300/80">
            {children}
        </div>
        );
}

export default AuthLayout;