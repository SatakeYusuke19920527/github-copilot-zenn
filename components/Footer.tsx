'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-foreground/10 bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-foreground/60">
          © {currentYear} Diary App
        </p>
      </div>
    </footer>
  );
}
