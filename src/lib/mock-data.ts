export type SiteStatus =
  | "Disponible"
  | "Mantenimiento"
  | "Ocupado"
  | "Reservado"
  | "En Instalación";

export type CampaignStatus = "Activa" | "Concluida" | "Programada" | "En Revisión";

export interface Registro {
  id: string;
  nombre: string;
  ciudad: string;
  estado: string;
  categoria: string;
  estatus: SiteStatus;
  dueno: string;
  direccion: string;
  ancho: number;
  alto: number;
  renta: number;
  marca: string | null;
  campana: string | null;
  campanaId: string | null;
  inicio: string | null;
  fin: string | null;
  estatusCampana: CampaignStatus | null;
  urlRepositorio: string;
  arteAprobado: boolean;
}

export const CATEGORIAS = [
  "Espectacular",
  "Pantalla Digital LED",
  "Muro Publicitario",
  "Valla Fija",
  "Valla Digital",
  "Unipolar",
  "Parabus / MUP",
  "Puente Peatonal",
  "Totem Digital",
  "Medallón de Autobús",
  "Caja de Luz (Backlight)",
];

export const CIUDADES: { ciudad: string; estado: string }[] = [
  { ciudad: "CDMX", estado: "Ciudad de México" },
  { ciudad: "Guadalajara", estado: "Jalisco" },
  { ciudad: "Monterrey", estado: "Nuevo León" },
  { ciudad: "Cancún", estado: "Quintana Roo" },
  { ciudad: "Tijuana", estado: "Baja California" },
  { ciudad: "La Paz", estado: "Baja California Sur" },
  { ciudad: "Mérida", estado: "Yucatán" },
  { ciudad: "Querétaro", estado: "Querétaro" },
  { ciudad: "Puebla", estado: "Puebla" },
  { ciudad: "Toluca", estado: "Estado de México" },
];

export const ESTATUS_SITIO: SiteStatus[] = [
  "Disponible",
  "Mantenimiento",
  "Ocupado",
  "Reservado",
  "En Instalación",
];

export const ESTATUS_CAMPANA: CampaignStatus[] = [
  "Activa",
  "Concluida",
  "Programada",
  "En Revisión",
];

export const MARCAS_ALSEA = [
  "Starbucks",
  "Burger King",
  "Domino's Pizza",
  "Vips",
  "Chili's",
  "P.F. Chang's",
];

export const MARCAS_OTRAS = [
  "Steren",
  "Adidas",
  "Nike",
  "Telcel",
  "Samsung",
  "Pepsi",
  "Coca Cola",
];

export const MARCAS = [...MARCAS_ALSEA, ...MARCAS_OTRAS];

export const MARCAS_AGENCIA = ["Adidas", "Steren", "Burger King", "Nike"];

export const DUENOS = [
  "Vendo Media",
  "IMU Publicidad",
  "Showcase Media",
  "Grupo Vallas MX",
  "Publimax",
  "Rentable OOH",
];

const VIALIDADES = [
  "Av. Insurgentes Sur",
  "Periférico Norte",
  "Av. Chapultepec",
  "Blvd. Manuel Ávila Camacho",
  "Av. López Mateos",
  "Carretera Federal 57",
  "Av. Constituyentes",
  "Blvd. Kukulcán",
  "Av. Revolución",
  "Calzada Independencia",
];

const CAMPANAS = [
  "Verano Refrescante",
  "Back to School",
  "Lanzamiento Premium",
  "Buen Fin",
  "Temporada Navideña",
  "Nueva Colección",
  "Promo 2x1",
  "Aniversario",
  "Menú de Temporada",
  "Activación Digital",
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

function fecha(rand: () => number, offsetDias: number) {
  const base = new Date(2026, 0, 1);
  base.setDate(base.getDate() + offsetDias);
  return base.toISOString().slice(0, 10);
}

export function generarRegistros(): Registro[] {
  const rand = mulberry32(20260911);
  const out: Registro[] = [];
  for (let i = 0; i < 1000; i++) {
    const loc = pick(CIUDADES, rand);
    const categoria = pick(CATEGORIAS, rand);
    const estatus = pick(ESTATUS_SITIO, rand);
    const dueno = pick(DUENOS, rand);
    const vialidad = pick(VIALIDADES, rand);
    const asignado = rand() > 0.28 && estatus !== "Disponible";
    const marca = asignado ? pick(MARCAS, rand) : null;
    const inicioOffset = Math.floor(rand() * 300);
    const dur = 30 + Math.floor(rand() * 90);
    const campanaNombre = pick(CAMPANAS, rand);

    out.push({
      id: `ST-${pad(1000 + i, 5)}`,
      nombre: `${categoria.split(" ")[0] ?? categoria} ${vialidad.replace(/^(Av\.|Blvd\.|Calzada|Carretera|Periférico)\s?/, "")} ${pad(
        Math.floor(rand() * 900) + 100,
        3,
      )}`,
      ciudad: loc.ciudad,
      estado: loc.estado,
      categoria,
      estatus,
      dueno,
      direccion: `${vialidad} #${Math.floor(rand() * 4000) + 100}, ${loc.ciudad}`,
      ancho: Number((4 + rand() * 14).toFixed(1)),
      alto: Number((2 + rand() * 8).toFixed(1)),
      renta: Math.round((25000 + rand() * 220000) / 500) * 500,
      marca,
      campana: marca ? `${campanaNombre} ${marca}` : null,
      campanaId: marca ? `CMP-${pad(4000 + i, 5)}` : null,
      inicio: marca ? fecha(rand, inicioOffset) : null,
      fin: marca ? fecha(rand, inicioOffset + dur) : null,
      estatusCampana: marca
        ? pick(ESTATUS_CAMPANA, rand)
        : null,
      urlRepositorio: `https://media.ooh.mx/arte/${pad(1000 + i, 5)}`,
      arteAprobado: rand() > 0.45,
    });
  }
  return out;
}

export function formatoFecha(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-") as [string, string, string];
  return `${d}/${m}/${y.slice(2)}`;
}

export function formatoMoneda(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}
