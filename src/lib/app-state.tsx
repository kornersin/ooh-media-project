import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { generarRegistros, type Registro } from "./mock-data";

export type Rol = "dueno" | "agencia" | "marca";

export const ROLES: { id: Rol; label: string; dot: string }[] = [
  { id: "dueno", label: "Rol: Dueño de Medio", dot: "bg-primary-700" },
  { id: "agencia", label: "Rol: Agencia", dot: "bg-secondary-600" },
  { id: "marca", label: "Rol: Marca (Grupo Alsea / Anunciante)", dot: "bg-success-text" },
];

interface Ctx {
  rol: Rol;
  setRol: (r: Rol) => void;
  sidebarExpandido: boolean;
  setSidebarExpandido: (expandido: boolean) => void;
  registros: Registro[];
  actualizar: (id: string, cambios: Partial<Registro>) => void;
  busquedaGlobal: string;
  setBusquedaGlobal: (s: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>("dueno");
  const [sidebarExpandido, setSidebarExpandido] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>(() => generarRegistros());
  const [busquedaGlobal, setBusquedaGlobal] = useState("");

  const value = useMemo<Ctx>(
    () => ({
      rol,
      setRol,
      sidebarExpandido,
      setSidebarExpandido,
      registros,
      busquedaGlobal,
      setBusquedaGlobal,
      actualizar: (id, cambios) =>
        setRegistros((prev) => prev.map((r) => (r.id === id ? { ...r, ...cambios } : r))),
    }),
    [rol, sidebarExpandido, registros, busquedaGlobal],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
