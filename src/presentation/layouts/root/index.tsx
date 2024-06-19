import { IChildren } from '@/core/types';
import { Header } from '@/presentation/components/Header';

export function RootStoreLayout({ children }: IChildren) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[100em] grid-rows-app gap-5 p-8">
      <Header />
      {children}
    </div>
  );
}
