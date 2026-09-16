import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/achievements", label: "Achievements" },
  { to: "/team", label: "Team" },
  { to: "/alumni", label: "Alumni" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/blog", label: "Blog" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="bg-ember px-2 py-1 font-display text-lg font-extrabold leading-none text-primary-foreground">
            TSI
          </span>
          <span className="hidden font-display text-sm uppercase tracking-[0.2em] text-muted-foreground sm:block">
            Team Saksham International
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="font-display text-sm uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-4 py-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="border-b border-border/40 py-3 font-display text-base uppercase tracking-[0.16em] text-muted-foreground last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Team Saksham International</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            The Baja SAE team of Vellore Institute of Technology, Chennai. Designed, built and
            driven by students.
          </p>
        </div>
        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">Explore</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {NAV.slice(1).map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">Admin</p>
          <Link to="/admin" className="mt-3 block text-sm text-muted-foreground hover:text-foreground">
            Team login
          </Link>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Team Saksham International, VIT Chennai.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <section className="racing-stripes border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="text-4xl sm:text-6xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <p className="border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
      {label}
    </p>
  );
}
