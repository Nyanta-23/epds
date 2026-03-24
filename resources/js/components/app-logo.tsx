import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white text-primary-foreground shadow-sm">
                <AppLogoIcon className="scale-200 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold tracking-wide text-primary">
                    SIMPONI
                </span>
            </div>
        </>
    );
}
