import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Badge ---------------- */

const TONOS: Record<string, string> = {
  Disponible: "text-success-text bg-success-bg border-success-border",
  Activa: "text-success-text bg-success-bg border-success-border",
  Mantenimiento: "text-warning-text bg-warning-bg border-warning-border",
  "En Revisión": "text-warning-text bg-warning-bg border-warning-border",
  "En Instalación": "text-warning-text bg-warning-bg border-warning-border",
  Programada: "text-warning-text bg-warning-bg border-warning-border",
  Ocupado: "text-error-text bg-error-bg border-error-border",
  Reservado: "text-error-text bg-error-bg border-error-border",
  Cancelada: "text-error-text bg-error-bg border-error-border",
  Concluida: "text-neutral-600 bg-neutral-200 border-neutral-300",
};

export function EstatusBadge({ valor }: { valor: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONOS[valor] ?? "text-neutral-600 bg-neutral-100 border-neutral-300",
      )}
    >
      {valor}
    </span>
  );
}

/* ---------------- Popover base ---------------- */

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return { open, setOpen, ref };
}

/* ---------------- Multiselect ---------------- */

export function MultiSelect({
  etiqueta,
  opciones,
  valores,
  onChange,
}: {
  etiqueta: string;
  opciones: string[];
  valores: string[];
  onChange: (v: string[]) => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const toggle = (o: string) =>
    onChange(valores.includes(o) ? valores.filter((v) => v !== o) : [...valores, o]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-sm transition-colors",
          valores.length
            ? "border-primary-200 text-primary-900 ring-2 ring-primary-100"
            : "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
        )}
      >
        <span className="truncate">
          {etiqueta}
          {valores.length > 0 && ` (${valores.length})`}
        </span>
        <ChevronDown className="size-4 shrink-0 text-neutral-500" />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 max-h-72 w-64 overflow-auto rounded-xl border border-neutral-300 bg-white p-1.5 shadow-xl">
          {opciones.map((o) => {
            const activo = valores.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-neutral-800 hover:bg-primary-100"
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded border",
                    activo
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-neutral-400 bg-white",
                  )}
                >
                  {activo && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="truncate">{o}</span>
              </button>
            );
          })}
          {valores.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-lg px-2 py-2 text-left text-xs font-medium text-primary-700 hover:bg-neutral-100"
            >
              Limpiar selección
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- DateRange Picker ---------------- */

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function Mes({
  anio,
  mes,
  desde,
  hasta,
  onPick,
}: {
  anio: number;
  mes: number;
  desde: string | null;
  hasta: string | null;
  onPick: (v: string) => void;
}) {
  const primero = new Date(anio, mes, 1);
  const offset = (primero.getDay() + 6) % 7;
  const dias = new Date(anio, mes + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: dias }, (_, i) => i + 1),
  ];

  return (
    <div className="w-60">
      <p className="mb-2 text-center text-sm font-semibold text-neutral-900">
        {MESES[mes]} {anio}
      </p>
      <div className="grid grid-cols-7 gap-0.5">
        {DIAS.map((d, i) => (
          <span key={i} className="py-1 text-center text-[11px] font-medium text-neutral-500">
            {d}
          </span>
        ))}
        {celdas.map((d, i) => {
          if (d === null) return <span key={i} />;
          const val = iso(new Date(anio, mes, d));
          const enRango = desde && hasta && val > desde && val < hasta;
          const extremo = val === desde || val === hasta;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(val)}
              className={cn(
                "h-8 rounded-md text-xs text-neutral-800 transition-colors hover:bg-primary-100",
                enRango && "bg-primary-100",
                extremo && "bg-primary-700 text-white hover:bg-primary-600",
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  desde,
  hasta,
  onChange,
}: {
  desde: string | null;
  hasta: string | null;
  onChange: (d: string | null, h: string | null) => void;
}) {
  const { open, setOpen, ref } = usePopover();
  const [cursor, setCursor] = useState(() => new Date(2026, 0, 1));

  const pick = (v: string) => {
    if (!desde || (desde && hasta)) onChange(v, null);
    else if (v < desde) onChange(v, desde);
    else onChange(desde, v);
  };

  const resumen =
    desde && hasta
      ? `${desde.slice(8)}/${desde.slice(5, 7)}/${desde.slice(2, 4)} - ${hasta.slice(8)}/${hasta.slice(5, 7)}/${hasta.slice(2, 4)}`
      : desde
        ? "Selecciona fecha final"
        : "Vigencia";

  const sig = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-sm transition-colors",
          desde
            ? "border-primary-200 text-primary-900 ring-2 ring-primary-100"
            : "border-neutral-300 text-neutral-700 hover:bg-neutral-100",
        )}
      >
        <span className="truncate">{resumen}</span>
        <ChevronDown className="size-4 shrink-0 text-neutral-500" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 rounded-xl border border-neutral-300 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="rounded-md px-2 py-1 text-sm text-primary-700 hover:bg-neutral-100"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="rounded-md px-2 py-1 text-sm text-primary-700 hover:bg-neutral-100"
            >
              Siguiente
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Mes
              anio={cursor.getFullYear()}
              mes={cursor.getMonth()}
              desde={desde}
              hasta={hasta}
              onPick={pick}
            />
            <Mes
              anio={sig.getFullYear()}
              mes={sig.getMonth()}
              desde={desde}
              hasta={hasta}
              onPick={pick}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="mt-2 text-xs font-medium text-primary-700 hover:underline"
          >
            Limpiar vigencia
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Single select ---------------- */

export function SingleSelect({
  valor,
  opciones,
  onChange,
  disabled,
  placeholder = "Selecciona una opción",
}: {
  valor: string | null;
  opciones: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        disabled={disabled}
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full appearance-none rounded-lg border px-3 pr-9 text-sm",
          disabled
            ? "cursor-not-allowed border-neutral-400 bg-neutral-200 text-neutral-500"
            : "border-neutral-300 bg-white text-neutral-900 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 focus:outline-none",
        )}
      >
        <option value="">{placeholder}</option>
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-3 right-3 size-4 text-neutral-500" />
    </div>
  );
}

export function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}

export function Entrada({
  value,
  onChange,
  disabled,
  type = "text",
}: {
  value: string | number;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 w-full rounded-lg border px-3 text-sm",
        disabled
          ? "cursor-not-allowed border-neutral-400 bg-neutral-200 text-neutral-500"
          : "border-neutral-300 bg-white text-neutral-900 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 focus:outline-none",
      )}
    />
  );
}

/* ---------------- Drawer ---------------- */

export function Drawer({
  abierto,
  onClose,
  titulo,
  subtitulo,
  children,
  footer,
}: {
  abierto: boolean;
  onClose: () => void;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="animate-in fade-in absolute inset-0 bg-primary-900/30 backdrop-blur-sm duration-200"
      />
      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-neutral-100 shadow-2xl",
          "animate-in slide-in-from-bottom duration-300",
          "md:top-0 md:left-auto md:h-full md:max-h-none md:w-[520px] md:rounded-none md:rounded-l-3xl md:slide-in-from-right",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-300 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-neutral-900">{titulo}</h2>
            {subtitulo && <p className="truncate text-sm text-neutral-600">{subtitulo}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-200"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-300 bg-neutral-100 px-5 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Botones ---------------- */

export function BotonPrimario({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
    >
      {children}
    </button>
  );
}

export function BotonSecundario({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
    >
      {children}
    </button>
  );
}

/* ---------------- Paginación ---------------- */

export function Paginacion({
  pagina,
  totalPaginas,
  onChange,
}: {
  pagina: number;
  totalPaginas: number;
  onChange: (p: number) => void;
}) {
  const paginas: (number | "...")[] = [];
  const push = (n: number) => !paginas.includes(n) && paginas.push(n);
  push(1);
  if (pagina > 3) paginas.push("...");
  for (let i = Math.max(2, pagina - 1); i <= Math.min(totalPaginas - 1, pagina + 1); i++) push(i);
  if (pagina < totalPaginas - 2) paginas.push("...");
  if (totalPaginas > 1) push(totalPaginas);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 py-4">
      <button
        onClick={() => onChange(Math.max(1, pagina - 1))}
        disabled={pagina === 1}
        className="rounded-lg px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 disabled:text-neutral-400 disabled:hover:bg-transparent"
      >
        Anterior
      </button>
      {paginas.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1 text-sm text-neutral-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "min-w-9 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
              p === pagina
                ? "bg-primary-700 text-white"
                : "text-neutral-700 hover:bg-primary-100",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(Math.min(totalPaginas, pagina + 1))}
        disabled={pagina === totalPaginas}
        className="rounded-lg px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 disabled:text-neutral-400 disabled:hover:bg-transparent"
      >
        Siguiente
      </button>
    </div>
  );
}

/* ---------------- Empty state ---------------- */

export function EstadoVacio({ onLimpiar }: { onLimpiar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary-100">
        <svg viewBox="0 0 24 24" fill="none" className="size-8 stroke-primary-700 stroke-2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-neutral-900">
        No se encontraron resultados para esta búsqueda
      </h3>
      <p className="mt-1 text-sm text-neutral-600">
        Prueba ajustando los filtros o el término de búsqueda
      </p>
      <div className="mt-5">
        <BotonPrimario onClick={onLimpiar}>Limpiar filtros</BotonPrimario>
      </div>
    </div>
  );
}
