import { IChildren } from '@/core/types';

export default function StoreTemplate({ children }: IChildren) {
  return <div className="animate-page-in">{children}</div>;
}
