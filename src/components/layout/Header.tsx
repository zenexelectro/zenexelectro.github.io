import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 flex w-full justify-between items-center md:justify-start">
          <Link className="mr-2 sm:mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold inline-block text-base sm:text-xl tracking-tight">
              ZENEX<span className="text-muted-foreground font-light text-[10px] sm:text-base">SYSTEMS</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/#services">Services</a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/#showcase">Showcase</a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/#contact">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
