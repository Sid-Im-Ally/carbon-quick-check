// String normalization helpers for location/city matching

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeCountryName(name: string): string {
  const mappings: Record<string, string> = {
    usa: 'united states',
    'u.s.a.': 'united states',
    'u.s.': 'united states',
    us: 'united states',
    uk: 'united kingdom',
    'u.k.': 'united kingdom',
    england: 'united kingdom',
    uae: 'united arab emirates',
    'u.a.e.': 'united arab emirates',
    emirates: 'united arab emirates',
    ksa: 'saudi arabia',
  };
  const normalized = normalizeString(name);
  return mappings[normalized] ?? normalized;
}

export function tokenMatch(query: string, target: string): boolean {
  const q = normalizeString(query);
  const t = normalizeString(target);
  return t.includes(q) || q.includes(t);
}
