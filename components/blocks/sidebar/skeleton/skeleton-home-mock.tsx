// Low-fidelity Home mock — exists purely to give the sidebar and
// notifications drawer real context to sit next to. Visual polish here is
// intentionally not a priority for this round.

import {
  RiBookmarkLine,
  RiCheckLine,
  RiFileTextLine,
  RiLineChartLine,
  RiSearch2Line,
  RiSparklingLine,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import type { CurrentOrg, CurrentUser } from './skeleton-mock-session';

type FeedItem = {
  id: string;
  icon: RemixiconComponentType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
};

const TODAY: FeedItem[] = [
  {
    id: 'deadline',
    icon: RiFileTextLine,
    iconColor: 'text-warning-base',
    title: 'Deadline in 2 days — "Highway maintenance framework, Region V"',
    description:
      'A tender you saved closes Wednesday, 15 Jul at 17:00. No proposal started yet.',
    time: '2h ago',
  },
  {
    id: 'match',
    icon: RiSparklingLine,
    iconColor: 'text-feature-base',
    title: '4 new tenders match "Rail signalling, > €500k"',
    description: 'Found by your saved search this morning. 2 close within 3 weeks.',
    time: '4h ago',
  },
];

const EARLIER: FeedItem[] = [
  {
    id: 'revision',
    icon: RiCheckLine,
    iconColor: 'text-success-base',
    title: 'Revision finished on "Water treatment plant upgrade"',
    description: 'Your requested changes are done and ready to review.',
    time: 'Yesterday',
  },
];

export function SkeletonHomeMock({
  user,
  org,
}: {
  user: CurrentUser;
  org: CurrentOrg;
}) {
  const firstName = user.name.split(' ')[0];

  return (
    <div className='flex-1 overflow-y-auto p-8'>
      <div className='mb-8'>
        <h1 className='text-title-h4 text-text-strong-950'>
          Good morning, {firstName}
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          Here&apos;s what changed since you were last here.
        </p>
      </div>

      <div className='mb-8 rounded-2xl border border-stroke-soft-200 bg-primary-alpha10 p-6'>
        <h3 className='text-label-md text-text-strong-950'>
          Finish setting up {org.name}
        </h3>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          A few steps left to get the most out of SpotGov.
        </p>
      </div>

      <div className='mb-2 text-label-sm text-text-strong-950'>Today</div>
      <div className='mb-8 flex flex-col divide-y divide-stroke-soft-200'>
        {TODAY.map((item) => (
          <FeedRow key={item.id} item={item} />
        ))}
      </div>

      <div className='mb-2 text-label-sm text-text-strong-950'>Earlier this week</div>
      <div className='mb-8 flex flex-col divide-y divide-stroke-soft-200'>
        {EARLIER.map((item) => (
          <FeedRow key={item.id} item={item} />
        ))}
      </div>

      <div className='mb-3 text-label-sm text-text-strong-950'>Jump back in</div>
      <div className='grid grid-cols-3 gap-4'>
        <WayfindingCard
          icon={RiSearch2Line}
          title='Discover'
          description='Active tenders, radar and direct invitations.'
        />
        <WayfindingCard
          icon={RiBookmarkLine}
          title='Workspace'
          description='Saved tenders, pipeline and revisions.'
        />
        <WayfindingCard
          icon={RiLineChartLine}
          title='Intelligence'
          description='Market intel, past tenders and frameworks.'
        />
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  return (
    <div className='flex items-start gap-4 py-4'>
      <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-inset ring-stroke-soft-200'>
        <Icon className={`size-4 ${item.iconColor}`} />
      </span>
      <div className='flex-1'>
        <p className='text-label-sm text-text-strong-950'>{item.title}</p>
        <p className='text-paragraph-sm text-text-sub-600'>{item.description}</p>
      </div>
      <span className='shrink-0 text-label-xs text-text-soft-400'>{item.time}</span>
    </div>
  );
}

function WayfindingCard({
  icon: Icon,
  title,
  description,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
}) {
  return (
    <div className='rounded-2xl border border-stroke-soft-200 p-6'>
      <span className='mb-3 flex size-9 items-center justify-center rounded-lg bg-primary-alpha10 text-primary-base'>
        <Icon className='size-[18px]' />
      </span>
      <h4 className='text-label-md text-text-strong-950'>{title}</h4>
      <p className='mt-1 text-paragraph-sm text-text-sub-600'>{description}</p>
    </div>
  );
}
