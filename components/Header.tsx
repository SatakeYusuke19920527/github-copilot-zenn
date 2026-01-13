'use client';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Diary App
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          {/* Navigation placeholder for future expansion */}
          <div className="text-sm text-foreground/60">
            {/* Add navigation items here */}
          </div>
        </nav>
      </div>
    </header>
  );
}
