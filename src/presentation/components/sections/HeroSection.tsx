import Image from 'next/image';
import HeroImg from '@@assets/hero.png';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  placeholderText?: string;
  buttonText?: string;
  bottomText?: string;
}

export function HeroSection({
  title = 'ESSÊNCIA',
  subtitle = 'Desperte sua',
  description = 'Seja a sua própria tendência, crie seu estilo, siga seus instintos e não tenha medo de ser diferente.',
  placeholderText = 'Digite seu e-mail',
  buttonText = 'Enviar',
  bottomText = 'Pré-salve agora a faça parte da revolução',
}: HeroSectionProps) {
  return (
    <div className="relative w-full h-72 sm:h-96 lg:h-[32rem] overflow-hidden">
      <Image
        src={HeroImg}
        fill
        quality={90}
        placeholder="blur"
        alt={title}
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 lg:px-16">
        <div className="max-w-xl">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-300 mb-2">
            {subtitle}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 mb-8 leading-relaxed max-w-md">
            {description}
          </p>

          <div className="flex flex-col items-start gap-3">
            <p className="text-xs sm:text-sm text-gray-300">
              Venha ser um dos primeiros
            </p>
            <div className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                placeholder={placeholderText}
                className="flex-1 px-4 py-2 bg-gray-800/80 text-white placeholder-gray-500 text-sm rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded hover:from-red-700 hover:to-red-800 transition-all text-sm">
                {buttonText}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              {bottomText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
