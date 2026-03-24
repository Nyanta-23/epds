import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src="/SIMPONI-PNG.png" alt="logo-simponi" {...props} />
    );
}
