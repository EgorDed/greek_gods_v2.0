/**
 * Цвет свечения узла по типу (как на референсе: God — фиолетовый, Hero — синий и т.д.)
 */
export function getNodeColor(typeEn: string): string {
  const colors: Record<string, string> = {
    God: "rgba(147, 51, 234, 0.7)",
    god: "rgba(147, 51, 234, 0.7)",
    Hero: "rgba(59, 130, 246, 0.7)",
    hero: "rgba(59, 130, 246, 0.7)",
    Place: "rgba(180, 83, 9, 0.7)",
    place: "rgba(180, 83, 9, 0.7)",
    Myth: "rgba(234, 88, 12, 0.7)",
    myth: "rgba(234, 88, 12, 0.7)",
    Event: "rgba(16, 185, 129, 0.7)",
    event: "rgba(16, 185, 129, 0.7)",
    Artifact: "rgba(217, 119, 6, 0.7)",
    artifact: "rgba(217, 119, 6, 0.7)",
  };
  return colors[typeEn] ?? "rgba(100, 116, 139, 0.7)";
}

/** Путь к иконке по коду узла (zeus, hera, apollo...) или по типу */
const ICON_BY_CODE: Record<string, string> = {
  zeus: "/icons/zeus.svg",
  hera: "/icons/hera.svg",
  apollo: "/icons/apollo.svg",
  athena: "/icons/athena.svg",
  aphena: "/icons/athena.svg", // опечатка в БД
  poseidon: "/icons/poseidon.svg",
  hades: "/icons/hades.svg",
  hercules: "/icons/hero.svg",
  heracles: "/icons/hero.svg",
  olympus: "/icons/place.svg",
  "test-node-1": "/icons/default.svg",
};

const ICON_BY_TYPE: Record<string, string> = {
  god: "/icons/zeus.svg",
  hero: "/icons/hero.svg",
  place: "/icons/place.svg",
  myth: "/icons/default.svg",
  event: "/icons/default.svg",
  artifact: "/icons/default.svg",
};

export function getNodeIconPath(code: string, typeEn: string): string {
  const lower = code?.toLowerCase() ?? "";
  return ICON_BY_CODE[lower] ?? ICON_BY_TYPE[typeEn?.toLowerCase() ?? ""] ?? "/icons/default.svg";
}

const PI = Math.PI;
const PI_4 = PI / 4;

/** Сторона ноды по углу (в радианах) от центра к другой точке: right, bottom, left, top */
function angleToSide(angle: number): "right" | "bottom" | "left" | "top" {
  if (angle >= -PI_4 && angle < PI_4) return "right";
  if (angle >= PI_4 && angle < 3 * PI_4) return "bottom";
  if (angle >= 3 * PI_4 || angle < -3 * PI_4) return "left";
  return "top";
}

/** Какие handle использовать для ребра: источник выходит в сторону цели, цель принимает с противоположной стороны */
export function getHandleIdsForEdge(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): { sourceHandle: string; targetHandle: string } {
  const angleToTarget = Math.atan2(targetY - sourceY, targetX - sourceX);
  const angleToSource = Math.atan2(sourceY - targetY, sourceX - targetX);
  const sourceSide = angleToSide(angleToTarget);
  const targetSide = angleToSide(angleToSource);
  return {
    sourceHandle: `source-${sourceSide}`,
    targetHandle: `target-${targetSide}`,
  };
}
