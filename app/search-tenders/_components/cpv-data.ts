// CPV (Common Procurement Vocabulary) — the EU code list that says what a
// tender is buying. A slice of the real vocabulary, not the whole 9,000+
// entry list: enough branches to cover every fixture in rich-state-flow.tsx
// and to make the hierarchy behaviour visible (picking "Construction work"
// has to pull in "Roadworks" and "School building construction work").
// Labels are the official CPV names, left long where the real ones are
// long — the picker and the chips both truncate rather than the data
// pretending names are shorter than they are.
//
// Real codes carry a check digit ("45233140-2"). It isn't stored: nothing
// here matches or displays on it, and a digit users can't act on is noise
// in a picker row that already shows an 8-digit code.

export type CpvEntry = {
  /** The 8-digit code, no check digit. */
  code: string;
  label: string;
};

// Ordered shallow-to-deep so the browse list (no query typed yet) reads as
// a vocabulary outline rather than an arbitrary code dump.
export const CPV_ENTRIES: CpvEntry[] = [
  // 30 — Office and computing machinery
  { code: '30000000', label: 'Office and computing machinery and supplies' },
  { code: '30200000', label: 'Computer equipment and supplies' },
  { code: '30213000', label: 'Personal computers' },

  // 33 — Medical equipment
  { code: '33000000', label: 'Medical equipments and pharmaceuticals' },
  { code: '33100000', label: 'Medical equipments' },
  { code: '33110000', label: 'Imaging equipment for medical use' },
  { code: '33111000', label: 'X-ray devices' },
  { code: '33190000', label: 'Miscellaneous medical devices and products' },

  // 45 — Construction
  { code: '45000000', label: 'Construction work' },
  { code: '45200000', label: 'Complete or part construction and civil engineering work' },
  { code: '45210000', label: 'Building construction work' },
  { code: '45212200', label: 'Construction work for sports facilities' },
  { code: '45213000', label: 'Construction work for commercial buildings' },
  { code: '45214200', label: 'School building construction work' },
  { code: '45221100', label: 'Bridge construction work' },
  { code: '45233000', label: 'Construction and surface work for highways and roads' },
  { code: '45233140', label: 'Roadworks' },
  { code: '45233220', label: 'Surface work for roads' },
  { code: '45233290', label: 'Installation of road signs' },
  { code: '45300000', label: 'Building installation work' },
  { code: '45310000', label: 'Electrical installation work' },
  { code: '45316100', label: 'Installation of outdoor illumination equipment' },

  // 48 — Software packages
  { code: '48000000', label: 'Software package and information systems' },
  { code: '48300000', label: 'Document creation and productivity software package' },
  { code: '48311000', label: 'Document management software package' },
  { code: '48900000', label: 'Miscellaneous software package and computer systems' },

  // 50 — Repair and maintenance services
  { code: '50000000', label: 'Repair and maintenance services' },
  { code: '50230000', label: 'Repair and maintenance services related to roads' },
  { code: '50232100', label: 'Street-lighting maintenance services' },
  { code: '50700000', label: 'Repair and maintenance of building installations' },
  { code: '50750000', label: 'Lift-maintenance services' },

  // 55 — Catering
  { code: '55000000', label: 'Hotel, restaurant and retail trade services' },
  { code: '55500000', label: 'Canteen and catering services' },
  { code: '55520000', label: 'Catering services' },

  // 72 — IT services
  { code: '72000000', label: 'IT services: consulting, software development and support' },
  { code: '72250000', label: 'System and support services' },
  { code: '72253000', label: 'Helpdesk and support services' },
  { code: '72600000', label: 'Computer support and consultancy services' },

  // 77 — Horticultural services
  { code: '77000000', label: 'Agricultural, forestry and horticultural services' },
  { code: '77300000', label: 'Horticultural services' },
  { code: '77310000', label: 'Planting and maintenance services of green areas' },
];

const BY_CODE = new Map(CPV_ENTRIES.map((entry) => [entry.code, entry]));

/** The label for a code, falling back to the bare code — a tender can carry
 * a CPV this slice of the vocabulary doesn't list, and printing the code is
 * more honest than printing nothing. */
export function cpvLabel(code: string): string {
  return BY_CODE.get(code)?.label ?? code;
}

/**
 * The part of a code that actually carries meaning: CPV pads every level
 * out to 8 digits with zeros, so "45000000" (division) is really "45",
 * "45200000" (group) is "452", and "45233140" is significant to its last
 * digit. Two-digit floor because divisions are always two digits —
 * stripping "30000000" down to "3" would make every 33-something code look
 * like a child of office machinery.
 */
function significantPrefix(code: string): string {
  const stripped = code.replace(/0+$/, '');
  return stripped.length < 2 ? code.slice(0, 2) : stripped;
}

/**
 * The build rule: a tender matches when its CPV *is* the selected code or
 * sits underneath it. CPV encodes the hierarchy in the digits themselves,
 * so this is a prefix test rather than a tree walk — which is also what
 * makes it work for codes outside the list above.
 */
export function isCpvOrDescendant(code: string, selectedCode: string): boolean {
  return code === selectedCode || code.startsWith(significantPrefix(selectedCode));
}

/** Every listed code above `code` in the hierarchy, broadest first. Used to
 * widen search: typing "construction roads" should find Roadworks through
 * its parent's name. */
function cpvAncestors(code: string): CpvEntry[] {
  return CPV_ENTRIES.filter(
    (entry) => entry.code !== code && isCpvOrDescendant(code, entry.code),
  );
}

const MAX_SEARCH_RESULTS = 40;

/**
 * Search by code, by name, or by a few words in any order — every
 * whitespace-separated term has to appear somewhere in the code, the label,
 * or an ancestor's label. Ancestors are in the haystack on purpose: "school
 * construction" should find "School building construction work" even though
 * the word "construction" reaches it through the parent for some entries.
 *
 * An empty query returns the divisions only — the top of the vocabulary, so
 * an unsearched picker reads as something to browse rather than a 40-row
 * wall.
 */
export function searchCpv(query: string): CpvEntry[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return CPV_ENTRIES.filter((entry) => entry.code.endsWith('000000'));
  }

  return CPV_ENTRIES.filter((entry) => {
    const haystack = `${entry.code} ${entry.label} ${cpvAncestors(entry.code)
      .map((ancestor) => ancestor.label)
      .join(' ')}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  }).slice(0, MAX_SEARCH_RESULTS);
}
