import { IChildren } from '@/core/types';

export default function StoreTemplate({ children }: IChildren) {
  return <div className="page-enter">{children}</div>;
}
