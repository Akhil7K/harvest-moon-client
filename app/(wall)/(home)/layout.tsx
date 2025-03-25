import { Navbar } from "@/components/nav/navbar";

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({
    children,
}: HomeLayoutProps) {
    return (
        <div className="h-screen w-full">
            <Navbar />
            {children}
        </div>
    )
}