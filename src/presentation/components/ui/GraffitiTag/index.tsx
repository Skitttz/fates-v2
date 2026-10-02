'use client';

import { CSSProperties, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useInView } from '@/presentation/hooks/useInView';
import { cn } from '@/presentation/utils/cn';
import {
  DRIP_START_Y,
  GRAFFITI_COLORS,
  GRAFFITI_DRIPS,
  GRAFFITI_DURATION_MS,
  GRAFFITI_TEXT,
  GRAFFITI_VIEWBOX,
  SWEEP_WIDTH,
} from './constants';
import { GraffitiLayers, GraffitiTagProps } from './types';

function Drips({ color, animated }: { color: string; animated: boolean }) {
  return (
    <g className={cn(!animated && 'graffiti-static')}>
      {GRAFFITI_DRIPS.map((drip) => (
        <g
          key={drip.x}
          style={
            { '--delay': `${drip.delay}s`, '--duration': `${drip.duration}s` } as CSSProperties
          }
        >
          <path
            d={`M ${drip.x} ${DRIP_START_Y} V ${DRIP_START_Y + drip.length}`}
            pathLength={1}
            className="graffiti-drip"
            stroke={color}
            strokeWidth={drip.width}
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx={drip.x}
            cy={DRIP_START_Y + drip.length + drip.width * 0.3}
            r={drip.width * 0.62}
            className="graffiti-drop"
            fill={color}
          />
        </g>
      ))}
    </g>
  );
}

/** palavra pichada: o spray passa letra por letra, a tinta escorre e cada hover repicha em outra cor */
export function GraffitiTag({ text, className }: GraffitiTagProps) {
  const [ref, inView] = useInView<SVGSVGElement>({ threshold: 0.35 });
  const uid = useId().replace(/:/g, '');
  const [layers, setLayers] = useState<GraffitiLayers>({ under: null, top: null, run: 0 });
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const tag = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setLayers(({ top, run }) => ({
      under: top,
      top: GRAFFITI_COLORS[run % GRAFFITI_COLORS.length],
      run: run + 1,
    }));
    timer.current = setTimeout(() => {
      busy.current = false;
    }, GRAFFITI_DURATION_MS);
  }, []);

  useEffect(() => {
    if (inView) tag();
  }, [inView, tag]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const textProps = {
    ...GRAFFITI_TEXT,
    lengthAdjust: 'spacingAndGlyphs',
    className: 'font-display uppercase',
  } as const;
  const maskUrl = `url(#${uid}-mask)`;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${GRAFFITI_VIEWBOX.width} ${GRAFFITI_VIEWBOX.height}`}
      aria-hidden="true"
      data-testid="graffiti-tag"
      data-color={layers.top ?? ''}
      onPointerEnter={tag}
      className={cn('w-full select-none overflow-visible', className)}
    >
      <defs>
        {/* borda irregular de spray: ruído deslocando a borda da máscara */}
        <filter id={`${uid}-edge`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.09" numOctaves={3} seed={4} />
          <feDisplacementMap
            in="SourceGraphic"
            scale={70}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id={`${uid}-mist`} x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
        <mask
          id={`${uid}-mask`}
          maskUnits="userSpaceOnUse"
          x={-100}
          y={-60}
          width={GRAFFITI_VIEWBOX.width + 200}
          height={GRAFFITI_VIEWBOX.height + 120}
        >
          <rect
            key={layers.run}
            className="graffiti-sweep"
            x={-SWEEP_WIDTH}
            y={-50}
            width={SWEEP_WIDTH}
            height={GRAFFITI_VIEWBOX.height + 100}
            fill="white"
            filter={`url(#${uid}-edge)`}
          />
        </mask>
      </defs>

      <text
        {...textProps}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      >
        {text}
      </text>

      {layers.under && (
        <g>
          <text {...textProps} fill={layers.under}>
            {text}
          </text>
          <Drips color={layers.under} animated={false} />
        </g>
      )}

      {layers.top && (
        <g key={layers.run}>
          <text
            {...textProps}
            fill={layers.top}
            opacity={0.45}
            filter={`url(#${uid}-mist)`}
            mask={maskUrl}
          >
            {text}
          </text>
          <text {...textProps} fill={layers.top} mask={maskUrl}>
            {text}
          </text>
          <Drips color={layers.top} animated />
        </g>
      )}
    </svg>
  );
}
