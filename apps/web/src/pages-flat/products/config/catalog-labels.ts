export const CATEGORY_LABELS: Record<string, string> = {
  indoor: "Комнатные",
  outdoor: "Садовые",
  garden: "Садовые",
};

export const CATEGORY_PAGE_TITLES: Record<string, string> = {
  indoor: "Комнатные растения",
  outdoor: "Садовые растения",
  garden: "Садовые растения",
};

export const SUBCATEGORY_LABELS: Record<string, string> = {
  aglaonema: "Аглаонема",
  aglaonemas: "Аглаонемы",
  alocasia: "Алоказия",
  aloe: "Алоэ",
  anthurium: "Антуриум",
  aroids: "Ароидные",
  begonia: "Бегония",
  bouquet: "Букеты",
  buket: "Букеты",
  bulbs: "Луковичные",
  cacti: "Кактусы",
  cactus: "Кактусы",
  calathea: "Калатея",
  chlorophytum: "Хлорофитум",
  citrus: "Цитрусовые",
  clematis: "Клематис",
  climbing: "Лианы и ампельные",
  conifers: "Хвойные",
  crassula: "Крассула",
  daffodil: "Нарцисс",
  decorative: "Декоративно-лиственные",
  "decorative-leaf": "Декоративно-лиственные",
  dekorativno_listvennye: "Декоративно-лиственные",
  dieffenbachia: "Диффенбахия",
  dracaena: "Драцена",
  epipremnum: "Эпипремнум",
  fern: "Папоротники",
  ferns: "Папоротники",
  fialka: "Фиалка",
  ficus: "Фикус",
  flowering: "Цветущие",
  gortenzia: "Гортензия",
  gortenziya: "Гортензия",
  hosta: "Хоста",
  hoya: "Хойя",
  hydrangea: "Гортензия",
  lavanda: "Лаванда",
  lavender: "Лаванда",
  liliya: "Лилия",
  lily: "Лилия",
  maranta: "Маранта",
  mnogoletniki: "Многолетники",
  monstera: "Монстера",
  narciss: "Нарцисс",
  orchid: "Орхидея",
  orchids: "Орхидеи",
  orhideya: "Орхидея",
  palm: "Пальмы",
  palms: "Пальмы",
  peony: "Пион",
  peperomia: "Пеперомия",
  perennials: "Многолетники",
  philodendron: "Филодендрон",
  pilea: "Пилея",
  pion: "Пион",
  rose: "Роза",
  roza: "Роза",
  sansevieria: "Сансевиерия",
  schefflera: "Шеффлера",
  scindapsus: "Сциндапсус",
  shrubs: "Кустарники",
  spathiphyllum: "Спатифиллум",
  spirea: "Спирея",
  succulent: "Суккуленты",
  succulents: "Суккуленты",
  syngonium: "Сингониум",
  thuja: "Туя",
  tulip: "Тюльпан",
  tulpan: "Тюльпан",
  tuya: "Туя",
  violet: "Фиалка",
  zamioculcas: "Замиокулькас",
};

export const TYPE_LABELS: Record<string, string> = {
  ampel: "Ампельные",
  ampelnye: "Ампельные",
  arborescens: "Древовидная",
  aroids: "Ароидные",
  bush: "Кустовые",
  collectors: "Коллекционные",
  compact: "Компактные",
  decorative: "Декоративно-лиственные",
  "decorative-leaf": "Декоративно-лиственные",
  drevovidnaya: "Древовидная",
  flowering: "Цветущие",
  green: "Зеленые",
  krupnolistnaya: "Крупнолистная",
  light: "Светолюбивые",
  macrophylla: "Крупнолистная",
  metelchataya: "Метельчатая",
  mini: "Мини",
  novice: "Для начинающих",
  paniculata: "Метельчатая",
  pestrye: "Пестрые",
  pink: "Розовые",
  rare: "Редкие",
  red: "Красные",
  shadow: "Теневыносливые",
  silver: "Серебристые",
  tall: "Крупномеры",
  variegated: "Вариегатные",
  white: "Белые",
};

export const DEFAULT_SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  indoor: ["aglaonema"],
  outdoor: ["gortenzia"],
};

export function decodeRouteSegment(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function lookupLabel(
  key: string,
  primary: Record<string, string>,
  secondary?: Record<string, string>,
): string {
  const trimmed = key.trim();
  if (!trimmed) return key;

  if (primary[trimmed]) return primary[trimmed];
  const lower = trimmed.toLowerCase();
  if (primary[lower]) return primary[lower];

  if (secondary) {
    if (secondary[trimmed]) return secondary[trimmed];
    if (secondary[lower]) return secondary[lower];
  }

  return trimmed;
}

export function getCategoryLabel(key: string): string {
  return lookupLabel(key, CATEGORY_LABELS);
}

export function getCategoryPageTitle(key: string): string {
  return lookupLabel(key, CATEGORY_PAGE_TITLES, CATEGORY_LABELS);
}

export function getSubcategoryLabel(key: string): string {
  return lookupLabel(key, SUBCATEGORY_LABELS, TYPE_LABELS);
}

export function getTypeLabel(key: string): string {
  return lookupLabel(key, TYPE_LABELS, SUBCATEGORY_LABELS);
}
