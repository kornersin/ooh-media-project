import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  LayoutGrid,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES, useApp } from "@/lib/app-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/campanas", label: "Campañas", icon: Megaphone },
] as const;

const STORAGE_KEY = "ooh:sidebar-expandido";

function RoleSwitcher({ compacto }: { compacto?: boolean }) {
  const { rol, setRol } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activo = ROLES.find((r) => r.id === rol)!;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 max-w-[15rem] items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        <span className={cn("size-2.5 shrink-0 rounded-full", activo.dot)} />
        <span className={cn("truncate", compacto && "hidden sm:inline")}>{activo.label}</span>
        <ChevronDown className="size-4 shrink-0 text-neutral-500" />
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 z-50 w-[min(18rem,80vw)] rounded-xl border border-neutral-300 bg-white p-1.5 shadow-xl",
            compacto
              ? "bottom-full mb-2 origin-bottom"
              : "top-full mt-2 origin-top",
          )}
        >
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRol(r.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors hover:bg-primary-100",
                r.id === rol ? "bg-primary-100 text-primary-900" : "text-neutral-800",
              )}
            >
              <span className={cn("size-2.5 shrink-0 rounded-full", r.dot)} />
              <span className="truncate">{r.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [expandido, setExpandido] = useState(false);
  const { busquedaGlobal, setBusquedaGlobal } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (guardado === "1") setExpandido(true);
  }, []);

  const alternar = () => {
    setExpandido((prev) => {
      window.localStorage.setItem(STORAGE_KEY, prev ? "0" : "1");
      return !prev;
    });
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-neutral-50 font-sans">
        {/* Sidebar Bento flotante — solo escritorio */}
        <aside
          className={cn(
            "fixed top-4 bottom-4 left-4 z-30 hidden flex-col rounded-3xl border border-[#CCBEF0]/60 bg-[#1D143D] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 md:flex",
            expandido ? "w-60" : "w-[4.5rem]",
          )}
        >
          <div className="mb-6 flex items-center gap-2.5 px-2 pt-2">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary-600 text-sm font-black text-primary-900">
              OO
            </div>
            {expandido && (
              <span className="truncate text-sm font-bold tracking-wide text-neutral-50">
                OOH Manager
              </span>
            )}
          </div>

          <nav className="flex flex-1 flex-col gap-1.5">
            {NAV.map((item) => {
              const activo = pathname === item.to;
              const enlace = (
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    !expandido && "justify-center",
                    activo
                      ? "bg-primary-100 text-primary-900"
                      : "text-primary-200 hover:bg-primary-700/50",
                  )}
                >
                  <item.icon className="size-5 shrink-0" />
                  {expandido && <span className="truncate">{item.label}</span>}
                </Link>
              );

              return expandido ? (
                <div key={item.to}>{enlace}</div>
              ) : (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{enlace}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          <button
            onClick={alternar}
            aria-label={expandido ? "Colapsar menú" : "Expandir menú"}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary-200 transition-colors hover:bg-primary-700/50",
              !expandido && "justify-center",
            )}
          >
            {expandido ? (
              <PanelLeftClose className="size-5 shrink-0" />
            ) : (
              <PanelLeftOpen className="size-5 shrink-0" />
            )}
            {expandido && <span>Colapsar</span>}
          </button>
        </aside>

        <div className={cn("transition-all duration-300", expandido ? "md:pl-68" : "md:pl-24")}>
          <div className="md:my-4 md:mr-4 md:overflow-hidden md:rounded-3xl md:border md:border-[#D1D5DB] md:bg-neutral-50 md:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            {/* Top bar */}
            <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-neutral-200 bg-neutral-50/90 px-4 py-3 backdrop-blur-md md:flex md:gap-6 md:px-6">
              <div className="relative min-w-0 md:mx-auto md:w-full md:max-w-xl">
                <Search className="absolute top-2.5 left-3 size-5 text-neutral-500" />
                <input
                  value={busquedaGlobal}
                  onChange={(e) => setBusquedaGlobal(e.target.value)}
                  placeholder="Buscar por ID o Nombre"
                  className="h-10 w-full rounded-lg border border-neutral-300 bg-white pr-3 pl-10 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden md:block">
                  <RoleSwitcher />
                </div>
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-700">
                  <UserRound className="size-5" />
                </div>
              </div>
            </header>

            <main className="px-4 pt-5 pb-28 md:px-6 md:pb-8">{children}</main>
          </div>
        </div>

        {/* Barra inferior — solo móvil */}
        <nav className="fixed right-0 bottom-0 left-0 z-50 grid grid-cols-3 items-center gap-1 border-t border-neutral-200 bg-white px-2 py-2 md:hidden">
          {NAV.map((item) => {
            const activo = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
                  activo ? "bg-primary-100 text-primary-700" : "text-neutral-600",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
          <div className="flex justify-center">
            <RoleSwitcher compacto />
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
