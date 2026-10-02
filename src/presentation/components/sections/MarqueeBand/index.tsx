import { Marquee } from '@/presentation/components/ui';
import { MARQUEE_PRIMARY_ITEMS, MARQUEE_SECONDARY_ITEMS } from './constants';

export function MarqueeBand() {
  return (
    <section aria-label="Destaques do drop" className="relative overflow-hidden py-16">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-3 border-y-2 border-black bg-street-orange py-2 text-black">
        <Marquee
          reverse
          items={MARQUEE_SECONDARY_ITEMS}
          itemClassName="font-display text-lg uppercase tracking-wider"
        />
      </div>
      <div className="relative -mx-[5%] -rotate-2 border-y-2 border-black bg-street-lime py-3 text-black shadow-brutal">
        <Marquee
          items={MARQUEE_PRIMARY_ITEMS}
          itemClassName="font-display text-2xl uppercase tracking-wider sm:text-3xl"
        />
      </div>
    </section>
  );
}
