'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Social } from "@/components/auth/social";
import BackButton from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    backButtonNote: string;
    showSocial?: boolean;
};

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    backButtonNote,
    showSocial,
}: CardWrapperProps) => {
    return(
        <Card className="w-96 shadow-md">
            <CardHeader className="text-center font-semibold">
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter className="items-center justify-center">
                <BackButton 
                    note={backButtonNote}
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}