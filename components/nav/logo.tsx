import RasorajLogo from '@/public/RasorajLogoWeb.png';
import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
    return ( 
        <div>
            <Link href={'/'}>
                <Image 
                    src={RasorajLogo} 
                    alt="Rasoraj Logo" 
                    width={300} 
                    height={300}
                    priority
                />
            </Link>
            
        </div>
    );
}