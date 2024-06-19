import { IChildren } from '@/core/types';

export function InternalLayout({ children }: IChildren) {
  return <div className="mx-auto grid min-h-screen">{children}</div>;
}
