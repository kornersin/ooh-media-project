import { useEffect, useState } from "react";
import { Check, CloudUpload, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, type Rol } from "@/lib/app-state";
import {
  CATEGORIAS,
  DUENOS,
  MARCAS,
  MARCAS_AGENCIA,
  MARCAS_ALSEA,
  formatoFecha,
  type Registro,
} from "@/lib/mock-data";
import {
  BotonPrimario,
  BotonSecundario,
  Campo,
  Drawer,
  Entrada,
  EstatusBadge,
  SingleSelect,
} from "./ui-kit";

const CAMPANAS_DEMO = [
  "Verano Refrescante",
  "Back to School",
  "Lanzamiento Premium",
  "Buen Fin",
  "Temporada Navideña",
  "Nueva Colección",
];

function permisos(rol: Rol) {
  return {
    editaTecnico: rol === "dueno",
    editaComercial: rol === "agencia",
    toggleArte: rol === "agencia",
    soloLectura: rol === "marca",
  };
}

export function RegistroDrawer({
  registro,
  onClose,
}: {
  registro: Registro | null;
  onClose: () => void;
}) {
  const { rol, actualizar } = useApp();
  const [form, setForm] = useState<Registro | null>(registro);

  useEffect(() => setForm(registro), [registro]);

  if (!registro || !form) return null;

  const p = permisos(rol);
  const esAlsea = form.marca ? MARCAS_ALSEA.includes(form.marca) : false;
  const ocultarComercial = rol === "marca" && !esAlsea;
  const set = (cambios: Partial<Registro>) => setForm({ ...form, ...cambios });

  const guardar = () => {
    actualizar(form.id, form);
    onClose();
  };

  return (
    <Drawer
      abierto
      onClose={onClose}
      titulo={form.nombre}
      subtitulo={`${form.id} · ${form.ciudad}, ${form.estado}`}
      footer={
        p.soloLectura ? (
          <BotonPrimario onClick={onClose}>Cerrar</BotonPrimario>
        ) : (
          <>
            <BotonSecundario onClick={onClose}>Cancelar</BotonSecundario>
            <BotonPrimario onClick={guardar}>Guardar cambios</BotonPrimario>
          </>
        )
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <EstatusBadge valor={form.estatus} />
        {form.estatusCampana && !ocultarComercial && (
          <EstatusBadge valor={form.estatusCampana} />
        )}
      </div>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-neutral-900">Especificaciones del sitio</h3>
        <Campo label="Categoría">
          <SingleSelect
            valor={form.categoria}
            opciones={CATEGORIAS}
            disabled={!p.editaTecnico}
            onChange={(v) => set({ categoria: v })}
          />
        </Campo>
        <Campo label="Dirección">
          <Entrada
            value={form.direccion}
            disabled={!p.editaTecnico}
            onChange={(v) => set({ direccion: v })}
          />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Ancho (m)">
            <Entrada
              type="number"
              value={form.ancho}
              disabled={!p.editaTecnico}
              onChange={(v) => set({ ancho: Number(v) })}
            />
          </Campo>
          <Campo label="Alto (m)">
            <Entrada
              type="number"
              value={form.alto}
              disabled={!p.editaTecnico}
              onChange={(v) => set({ alto: Number(v) })}
            />
          </Campo>
        </div>
        <Campo label="Dueño de Medios">
          <SingleSelect
            valor={form.dueno}
            opciones={DUENOS}
            disabled={!p.editaTecnico}
            onChange={(v) => set({ dueno: v })}
          />
        </Campo>
        <Campo label="Renta Mensual ($ MXN)">
          <Entrada
            type="number"
            value={form.renta}
            disabled={!p.editaTecnico}
            onChange={(v) => set({ renta: Number(v) })}
          />
        </Campo>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-neutral-900">Asignación comercial</h3>
        {ocultarComercial ? (
          <p className="rounded-xl bg-neutral-100 px-3 py-6 text-center text-sm text-neutral-600">
            Información reservada. Este sitio no pertenece a una marca de Grupo Alsea.
          </p>
        ) : (
          <>
            <Campo label="Marca asignada">
              <SingleSelect
                valor={form.marca}
                opciones={rol === "agencia" ? MARCAS_AGENCIA : MARCAS}
                disabled={!p.editaComercial}
                placeholder="Sin marca asignada"
                onChange={(v) => set({ marca: v })}
              />
            </Campo>
            <Campo label="Campaña asignada">
              <SingleSelect
                valor={form.campana}
                opciones={
                  form.campana ? [form.campana, ...CAMPANAS_DEMO] : CAMPANAS_DEMO
                }
                disabled={!p.editaComercial}
                placeholder="Sin campaña asignada"
                onChange={(v) => set({ campana: v })}
              />
            </Campo>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-neutral-600">Vigencia</p>
                <p className="font-medium text-neutral-900">
                  {formatoFecha(form.inicio)} - {formatoFecha(form.fin)}
                </p>
              </div>
              <div>
                <p className="text-neutral-600">ID de campaña</p>
                <p className="font-medium text-neutral-900">{form.campanaId ?? "—"}</p>
              </div>
            </div>
            <Campo label="URL de repositorio">
              <Entrada
                value={form.urlRepositorio}
                disabled={!p.editaComercial}
                onChange={(v) => set({ urlRepositorio: v })}
              />
            </Campo>
          </>
        )}
      </section>

      {!ocultarComercial && (
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-neutral-900">Arte publicitario</h3>
          <div
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center",
              p.editaComercial
                ? "cursor-pointer border-primary-200 bg-primary-100/40 hover:bg-primary-100"
                : "border-neutral-300 bg-neutral-100",
            )}
          >
            {p.editaComercial ? (
              <>
                <CloudUpload className="size-7 text-primary-700" />
                <p className="text-sm font-medium text-neutral-800">
                  Arrastra el arte aquí o haz clic para reemplazar
                </p>
                <p className="text-xs text-neutral-500">JPG, PNG o PDF · hasta 25 MB</p>
              </>
            ) : (
              <>
                <FileImage className="size-7 text-neutral-500" />
                <p className="text-sm font-medium text-neutral-800">
                  arte_{form.id.toLowerCase()}.jpg
                </p>
                <p className="text-xs text-neutral-500">Archivo cargado · vista previa adjunta</p>
              </>
            )}
          </div>

          <button
            type="button"
            disabled={!p.toggleArte}
            onClick={() => p.toggleArte && set({ arteAprobado: !form.arteAprobado })}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm",
              p.toggleArte
                ? "border-neutral-300 bg-white hover:bg-primary-100"
                : "cursor-not-allowed border-neutral-300 bg-neutral-200",
            )}
          >
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded border",
                form.arteAprobado
                  ? "border-primary-700 bg-primary-700 text-white"
                  : "border-neutral-400 bg-white",
              )}
            >
              {form.arteAprobado && <Check className="size-3.5" strokeWidth={3} />}
            </span>
            <span className="text-neutral-800">Arte aprobado por el cliente</span>
            {!p.toggleArte && (
              <span className="ml-auto text-xs text-neutral-500">Solo lectura</span>
            )}
          </button>
        </section>
      )}
    </Drawer>
  );
}
