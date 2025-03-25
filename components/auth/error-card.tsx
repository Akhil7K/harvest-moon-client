
import { FaExclamationTriangle } from "react-icons/fa"
import { CardWrapper } from "./card-wrapper"

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            backButtonLabel="Sign-in"
            backButtonHref="/auth/sign-in"
            backButtonNote="Want to go back?"
        >
            <div className="w-full flex items-center justify-center">
                <FaExclamationTriangle className="text-destructive" />
            </div>
        </CardWrapper>
    )
}