import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RegistroDrawer } from "@/components/RegistroDrawer";
import {
  DateRangePicker,
  EstadoVacio,
  EstatusBadge,
  MultiSelect,
  Paginacion,
} from "@/components/ui-kit";
import { useApp } from "@/lib/app-state";
import {
  CIUDADES,
  ESTATUS_CAMPANA,
  MARCAS,
  MARCAS_AGENCIA,
  MARCAS_ALSEA,
  formatoFecha,
  type Registro,
} from "@/lib/mock-data";

export const Route = createFileRoute("/campanas")({
  head: () => ({
    meta: [
      { title: "Campañas Publicitarias OOH | Plataforma de Medios" },
      {
        name: "description",
        content:
          "Consulta vigencias, marcas y estatus de las campañas de medios exteriores activas, programadas y concluidas.",
      },
      { property: "og:title", content: "Campañas Publicitarias OOH" },
      {
        property: "og:description",
        content: "Seguimiento de campañas OOH por marca, ubicación, vigencia y estatus.",
      },
    ],
  }),
  component: Campanas,
});

const POR_PAGINA = 10;

function Campanas() {
  const { rol, registros, busquedaGlobal } = useApp();
  const [busqueda, setBusqueda] = useState("");
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [estatus, setEstatus] = useState<string[]>([]);
  const [desde, setDesde] = useState<string | null>(null);
  const [hasta, setHasta] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [abierto, setAbierto] = useState<Registro | null>(null);
  const [filtrosMovil, setFiltrosMovil] = useState(false);

  const marcasDisponibles =
    rol === "marca" ? MARCAS_ALSEA : rol === "agencia" ? MARCAS_AGENCIA : MARCAS;

  const limpiar = () => {
    setBusqueda("");
    setCiudades([]);
    setMarcas([]);
    setEstatus([]);
    setDesde(null);
    setHasta(null);
    setPagina(1);
  };

  const visibles = useMemo(() => {
    const q = `${busqueda} ${busquedaGlobal}`.trim().toLowerCase();
    return registros.filter((r) => {
      if (!r.campana || !r.marca) return false;
      if (!marcasDisponibles.includes(r.marca)) return false;
      if (q && !`${r.campana} ${r.campanaId}`.toLowerCase().includes(q)) return false;
      if (ciudades.length && !ciudades.includes(r.ciudad)) return false;
      if (marcas.length && !marcas.includes(r.marca)) return false;
      if (estatus.length && !estatus.includes(r.estatusCampana ?? "")) return false;
      if (desde && r.fin && r.fin < desde) return false;
      if (hasta && r.inicio && r.inicio > hasta) return false;
      return true;
    });
  }, [
    registros,
    marcasDisponibles,
    busqueda,
    busquedaGlobal,
    ciudades,
    marcas,
    estatus,
    desde,
    hasta,
  ]);

  const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const filas = visibles.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const accion = rol === "marca" ? "Ver más" : "Editar";
  const segundaColumna = rol === "dueno" ? "Ubicación" : "Marca";

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Campañas</h1>
        <p className="mt-1 text-sm text-neutral-600">
          {rol === "marca"
            ? "Vista corporativa unificada de Grupo Alsea y sus sub-marcas"
            : `${visibles.length.toLocaleString("es-MX")} campañas en tu portafolio`}
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
              etiqueta="Marca"
              opciones={marcasDisponibles}
              valores={marcas}
              onChange={(v) => {
                setMarcas(v);
                setPagina(1);
              }}
            />
            <DateRangePicker
              desde={desde}
              hasta={hasta}
              onChange={(d, h) => {
                setDesde(d);
                setHasta(h);
                setPagina(1);
              }}
            />
            <MultiSelect
              etiqueta="Estatus"
              opciones={ESTATUS_CAMPANA}
              valores={estatus}
              onChange={(v) => {
                setEstatus(v);
                setPagina(1);
              }}
            />
          </div>
        </div>

        {filas.length === 0 ? (
          <EstadoVacio onLimpiar={limpiar} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300 bg-[#EAE3FA] text-xs font-semibold tracking-wide text-slate-600 uppercase">
                    <th className="px-4 py-3">Campaña / ID</th>
                    <th className="px-4 py-3">{segundaColumna}</th>
                    <th className="px-4 py-3">Vigencia</th>
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
                        <p className="font-medium text-neutral-900">{r.campana}</p>
                        <p className="text-xs text-neutral-500">{r.campanaId}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-800">
                        {rol === "dueno" ? r.ciudad : r.marca}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-neutral-800">
                        {formatoFecha(r.inicio)} - {formatoFecha(r.fin)}
                      </td>
                      <td className="px-4 py-3">
                        <EstatusBadge valor={r.estatusCampana ?? "—"} />
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

            <div className="divide-y divide-neutral-200 md:hidden">
              {filas.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">{r.campana}</p>
                      <p className="text-xs text-neutral-500">{r.campanaId}</p>
                    </div>
                    <EstatusBadge valor={r.estatusCampana ?? "—"} />
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    {r.ciudad} · {formatoFecha(r.inicio)} - {formatoFecha(r.fin)}
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

            <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onChange={setPagina} />
          </>
        )}
      </div>

      <RegistroDrawer registro={abierto} onClose={() => setAbierto(null)} />
    </AppShell>
  );
}
