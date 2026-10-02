import { IChildren } from '@/core/types';
import { StoreLayout } from '@/presentation/layouts/store';

export default function StoreRouteLayout({ children }: IChildren) {
  return <StoreLayout>{children}</StoreLayout>;
}
