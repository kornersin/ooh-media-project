import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RegistroDrawer } from "@/components/RegistroDrawer";
import {
  EstadoVacio,
  EstatusBadge,
  MultiSelect,
  Paginacion,
} from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";
import {
  CATEGORIAS,
  CIUDADES,
  DUENOS,
  ESTATUS_SITIO,
  MARCAS_ALSEA,
  type Registro,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inventario de Sitios OOH | Plataforma de Medios" },
      {
        name: "description",
        content:
          "Administra tu inventario de medios exteriores: espectaculares, pantallas digitales y vallas con control de accesos por rol.",
      },
      { property: "og:title", content: "Inventario de Sitios OOH" },
      {
        property: "og:description",
        content: "Dashboard de gestión de medios exteriores con filtros, roles y campañas.",
      },
    ],
  }),
  component: Dashboard,
});

const POR_PAGINA = 10;

function Dashboard() {
  const { rol, registros, busquedaGlobal } = useApp();
  const [busqueda, setBusqueda] = useState("");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [estatus, setEstatus] = useState<string[]>([]);
  const [duenos, setDuenos] = useState<string[]>([]);
  const [pagina, setPagina] = useState(1);
  const [abierto, setAbierto] = useState<Registro | null>(null);
  const [filtrosMovil, setFiltrosMovil] = useState(false);

  const limpiar = () => {
    setBusqueda("");
    setCiudades([]);
    setCategorias([]);
    setEstatus([]);
    setDuenos([]);
    setPagina(1);
  };

  const visibles = useMemo(() => {
    const q = `${busqueda} ${busquedaGlobal}`.trim().toLowerCase();
    return registros.filter((r) => {
      if (rol === "marca") {
        const permitido = !r.marca || MARCAS_ALSEA.includes(r.marca);
        if (!permitido) return false;
      }
      if (q && !(`${r.nombre} ${r.id}`.toLowerCase().includes(q))) return false;
      if (ciudades.length && !ciudades.includes(r.ciudad)) return false;
      if (categorias.length && !categorias.includes(r.categoria)) return false;
      if (estatus.length && !estatus.includes(r.estatus)) return false;
      if (duenos.length && !duenos.includes(r.dueno)) return false;
      return true;
    });
  }, [registros, rol, busqueda, busquedaGlobal, ciudades, categorias, estatus, duenos]);

  const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const filas = visibles.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const accion = rol === "marca" ? "Ver más" : "Editar";

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Inventario de Sitios
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {visibles.length.toLocaleString("es-MX")} sitios disponibles según tu rol activo
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:hidden">
            <input
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar por ID o Nombre"
              className="h-10 w-full min-w-0 rounded-lg border border-neutral-300 px-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 focus:outline-none"
            />
            <button
              onClick={() => setFiltrosMovil(!filtrosMovil)}
              className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-neutral-300 px-3 text-sm font-medium text-neutral-700"
            >
              <SlidersHorizontal className="size-4" />
              Filtros
            </button>
          </div>

          <div
            className={`${filtrosMovil ? "mt-3 grid" : "hidden"} grid-cols-1 gap-3 sm:grid-cols-2 md:mt-0 md:grid md:grid-cols-5`}
          >
            <input
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              placeholder="Buscar por ID o Nombre"
              className="hidden h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 focus:outline-none md:block"
            />
            <MultiSelect
              etiqueta="Ubicación"
              opciones={CIUDADES.map((c) => c.ciudad)}
              valores={ciudades}
              onChange={(v) => {
                setCiudades(v);
                setPagina(1);
              }}
            />
            <MultiSelect
              etiqueta="Categoría"
              opciones={CATEGORIAS}
              valores={categorias}
              onChange={(v) => {
                setCategorias(v);
                setPagina(1);
              }}
            />
            <MultiSelect
              etiqueta="Estatus"
              opciones={ESTATUS_SITIO}
              valores={estatus}
              onChange={(v) => {
                setEstatus(v);
                setPagina(1);
              }}
            />
            <MultiSelect
              etiqueta="Dueño de Medio"
              opciones={DUENOS}
              valores={duenos}
              onChange={(v) => {
                setDuenos(v);
                setPagina(1);
              }}
            />
          </div>
        </div>

        {filas.length === 0 ? (
          <EstadoVacio onLimpiar={limpiar} />
        ) : (
          <>
            {/* Tabla escritorio */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300 text-xs font-semibold tracking-wide text-neutral-600 uppercase">
                    <th className="px-4 py-3">Sitio / ID</th>
                    <th className="px-4 py-3">Ciudad / Estado</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Estatus</th>
                    <th className="px-4 py-3">Dueño de Medios</th>
                    <th className="px-4 py-3 text-right" />
                  </tr>
                </thead>
                <tbody>
                  {filas.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-primary-100/60"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-neutral-900">{r.nombre}</p>
                        <p className="text-xs text-neutral-500">{r.id}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-800">
                        {r.ciudad}
                        <span className="block text-xs text-neutral-500">{r.estado}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-800">{r.categoria}</td>
                      <td className="px-4 py-3">
                        <EstatusBadge valor={r.estatus} />
                      </td>
                      <td className="px-4 py-3 text-neutral-800">{r.dueno}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setAbierto(r)}
                          className="text-sm font-semibold text-primary-700 hover:text-primary-600 hover:underline"
                        >
                          {accion}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas móvil */}
            <div className="divide-y divide-neutral-200 md:hidden">
              {filas.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">{r.nombre}</p>
                      <p className="text-xs text-neutral-500">{r.id}</p>
                    </div>
                    <EstatusBadge valor={r.estatus} />
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    {r.ciudad} · {r.categoria}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setAbierto(r)}
                      className="text-sm font-semibold text-primary-700 hover:underline"
                    >
                      {accion}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Paginacion
              pagina={paginaActual}
              totalPaginas={totalPaginas}
              onChange={setPagina}
            />
          </>
        )}
      </div>

      <RegistroDrawer registro={abierto} onClose={() => setAbierto(null)} />
    </AppShell>
  );
}
