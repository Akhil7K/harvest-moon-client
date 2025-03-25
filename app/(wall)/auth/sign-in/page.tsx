import { LoginForm } from "@/components/auth/login-form"

const SignIn = () => {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="font-semibold space-y-4 w-1/2 justify-items-center">
                <p className="text-8xl text-white tracking-wider">Rasoraj:</p>
                <p className="text-5xl text-red-800 tracking-wider">Delta&apos;s soul on</p>
                <p className="text-5xl text-red-800 tracking-wider">your plate</p>
            </div>
            <div className="w-1/2 justify-items-center">
                <LoginForm />
            </div>
        </div>
    )
}

export default SignIn;