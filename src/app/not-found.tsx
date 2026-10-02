import { NotFound } from '@/presentation/pages/not-found';
import { StoreLayout } from '@/presentation/layouts/store';

export default function NotFoundRouter() {
  return (
    <StoreLayout>
      <NotFound />
    </StoreLayout>
  );
}
