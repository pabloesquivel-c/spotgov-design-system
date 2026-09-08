// Mock data for the notifications drawer scratch route. Not production.
// Fields come from the spec's "Data shown" list and nothing else: five types,
// no invented enums. Ported from .context/notifications-drawer.html.
//
// The five types, their order, and every string in the default dataset are
// transcribed from the Figma frame (nodes 2276:9177 through 2276:9181). The
// order there is not newest-first, so the list renders seed order rather than
// sorting on createdAt. See buildData below.

import {
  RiAtLine,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiPriceTag3Line,
  RiShieldUserLine,
  type RemixiconComponentType,
} from '@remixicon/react';

export type NotificationType =
  'mention' | 'owner' | 'custom_field' | 'revision' | 'opportunity';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  createdAt: string;
  actorName: string | null;
  tenderTitle: string;
  issuer: string | null;
  tenderId?: number | null;
  noteId?: number;
  phase?: string;
  fieldName?: string;
  savedSearchName?: string;
  batchId?: string;
  /**
   * Opportunity rows only. How many tenders the batch turned up, which is the
   * description line. Distinct from the batch's own count, which is what the
   * button offers to open. Figma node 2276:9181 shows them disagreeing.
   */
  matchesFound?: number;
  /** A real destination that lands on a not-yet-built page. */
  placeholder?: string | null;
  read: boolean;
};

/** One hardcoded now, so every relative date in the route is stable. */
export const TODAY = new Date('2026-09-07T18:40:00');

const ago = (minutes: number) =>
  new Date(TODAY.getTime() - minutes * 60_000).toISOString();

export const TYPE_META: Record<
  NotificationType,
  {
    icon: RemixiconComponentType;
    /** Whether this type has a human actor whose avatar can stand in. */
    person: boolean;
    /**
     * System-type icons are pre-coloured pictograms (node 2303:28774's
     * "Warning" glyph is a solid #335CFF fill), not neutral line icons tinted
     * by the caller. Person types never read this: they render an avatar.
     */
    iconClassName: string;
  }
> = {
  mention: { icon: RiAtLine, person: true, iconClassName: '' },
  owner: { icon: RiShieldUserLine, person: true, iconClassName: '' },
  custom_field: { icon: RiPriceTag3Line, person: true, iconClassName: '' },
  revision: {
    icon: RiCheckboxCircleFill,
    person: false,
    // Figma's "Success" glyph is a solid #178C4E fill, which is green-700,
    // not the success-base alias (green-500) — the literal colour, not the
    // nearest semantic token.
    iconClassName: 'text-green-700',
  },
  opportunity: {
    icon: RiErrorWarningFill,
    person: false,
    iconClassName: 'text-primary-base',
  },
};

/**
 * 140 characters. The Figma copy is all short, so this now only appears in the
 * `many` dataset: the truncation case still has somewhere to be exercised.
 */
const LONG_TITLE =
  'Aquisição de serviços de manutenção preventiva e corretiva das instalações técnicas especiais dos edifícios escolares do concelho, incluindo AVAC, elevadores e deteção de incêndio';

type Seed = Omit<NotificationItem, 'read'>;

// The four person-and-system rows, in Figma's order. Timestamps are read off
// the frame rather than chosen, which is why they do not descend.
const PEOPLE: Seed[] = [
  {
    id: 'n1',
    type: 'mention',
    createdAt: ago(8),
    actorName: 'Juma Omondi',
    noteId: 17,
    tenderTitle: 'Regional School Meals Tender',
    issuer: 'Lisbon City Council',
    tenderId: 4821,
  },
  {
    id: 'n2',
    type: 'owner',
    createdAt: ago(120),
    actorName: 'Sofia Williams',
    phase: 'Proposal',
    tenderTitle: 'Road Maintenance Framework',
    issuer: 'Porto Municipality',
    tenderId: 4776,
  },
  {
    id: 'n3',
    type: 'custom_field',
    createdAt: ago(180),
    actorName: 'Arthur Taylor',
    fieldName: 'Reviewer',
    tenderTitle: 'Public Transport Services',
    issuer: 'Braga Metropolitan Area',
    tenderId: 4690,
  },
  {
    // No actor: the copy is about the system finishing a job, not a person.
    id: 'n4',
    type: 'revision',
    createdAt: ago(240),
    actorName: null,
    tenderTitle: 'Digital Records Platform',
    issuer: 'Coimbra University',
    tenderId: 4712,
  },
];

const SEARCHES_B = ['IT Services in Portugal'];

const ISSUERS = [
  'Município de Lisboa',
  'Infraestruturas de Portugal',
  'Universidade do Porto',
  'ULS de Coimbra',
  'Município de Vila Nova de Gaia',
  'Direção-Geral do Território',
  'IPO Porto',
  'Metro do Porto',
];

const SUBJECTS = [
  'Aquisição de mobiliário urbano',
  'Empreitada de reabilitação do edifício sede',
  'Prestação de serviços de transporte escolar',
  'Fornecimento de material de consumo clínico',
  'Aquisição de viaturas ligeiras elétricas',
  'Serviços de consultoria em eficiência energética',
  'Empreitada de construção de ciclovia',
  'Fornecimento de energia elétrica em MT',
  'Aquisição de equipamento laboratorial',
  'Serviços de manutenção de espaços verdes',
  'Empreitada de reforço estrutural de ponte',
  'Aquisição de sistema de videovigilância',
];

export type Batch = {
  id: string;
  label: string;
  at: string;
  searches: string[];
  /** What the row's button offers to open. */
  count: number;
  /** What the row's description reports. */
  found: number;
};

export const BATCHES: Batch[] = [
  {
    id: 'b-1720',
    label: 'Today, 17:20',
    at: ago(12),
    searches: SEARCHES_B,
    count: 12,
    found: 21,
  },
];

// Not grouped: one notification per batch, carrying the match count rather
// than one row per matched tender.
function buildBatchRow(batch: Batch, index: number): Seed {
  return {
    id: batch.id,
    type: 'opportunity' as const,
    batchId: batch.id,
    createdAt: batch.at,
    actorName: null,
    savedSearchName: batch.searches[0],
    matchesFound: batch.found,
    tenderTitle: SUBJECTS[index % SUBJECTS.length],
    issuer: ISSUERS[index % ISSUERS.length],
    tenderId: 5000 + batch.id.length * 13 + index,
    placeholder: null,
  };
}

export type Dataset = 'mixed' | 'opportunities' | 'people' | 'many' | 'tiny';

export type BuildOptions = {
  dataset: Dataset;
  /** How many of the newest items start unread. */
  unreadCount: number;
};

export type BuiltData = {
  items: NotificationItem[];
  /** Header totals, independent of how many batch rows are on screen. */
  batchTotals: Record<string, number>;
};

export function buildData({ dataset, unreadCount }: BuildOptions): BuiltData {
  let seeds: Seed[] = [];
  const batchTotals: Record<string, number> = {};

  if (dataset !== 'opportunities') {
    seeds = seeds.concat(PEOPLE);
  }
  if (dataset === 'tiny') {
    seeds = seeds.slice(0, 3);
  }

  if (dataset !== 'people' && dataset !== 'tiny') {
    BATCHES.forEach((batch, index) => {
      batchTotals[batch.id] = batch.count;
      seeds.push(buildBatchRow(batch, index));
    });
  }

  if (dataset === 'many') {
    for (let i = 0; i < 24; i += 1) {
      const seed = PEOPLE[i % PEOPLE.length];
      seeds.push({
        ...seed,
        id: `x${i}`,
        createdAt: ago(320 + i * 137),
        // Every fourth filler row carries the 140-character title, so the
        // truncation case is still reachable from the route.
        tenderTitle: i % 4 === 0 ? LONG_TITLE : seed.tenderTitle,
      });
    }

    const older: Batch = {
      id: 'b-old',
      label: '5 Sep, 09:20',
      at: ago(4000),
      searches: SEARCHES_B,
      count: 120,
      found: 120,
    };
    batchTotals[older.id] = older.count;
    seeds.push(buildBatchRow(older, BATCHES.length));
  }

  // Seed order, not createdAt order. Figma fixes the sequence of the five
  // default rows and it is not newest-first, so sorting here would silently
  // overrule the design. Every dataset below is authored in display order.
  const items: NotificationItem[] = seeds.map((seed, index) => ({
    ...seed,
    read: index >= unreadCount,
  }));

  return { items, batchTotals };
}

export function batchLabel(batchId: string) {
  if (batchId === 'b-old') return '5 Sep, 09:20';
  return BATCHES.find((batch) => batch.id === batchId)?.label ?? '';
}

/**
 * Relative time, short form, from the one hardcoded TODAY. Figma writes it as
 * "8m ago", so the suffix belongs here rather than at the call site: `now` and
 * `Yesterday` are already past tense and must not take it.
 */
export function relativeTime(iso: string) {
  const minutes = Math.round((+TODAY - +new Date(iso)) / 60_000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}
