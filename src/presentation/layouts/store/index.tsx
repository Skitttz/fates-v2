import { IChildren } from '@/core/types';
import { Footer, Header } from '@/presentation/components/layout';

export function StoreLayout({ children }: IChildren) {
  return (
    <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] grid-rows-app overflow-x-clip">
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
