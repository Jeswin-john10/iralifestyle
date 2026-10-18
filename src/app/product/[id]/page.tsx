import React, { Suspense } from 'react';
import { initialProducts } from '@/lib/data';
import ProductDetailClient from '@/components/ProductDetailClient';

export function generateStaticParams() {
  return initialProducts.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const { id } = resolved;

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center text-sm text-[#8F867C]">
          Curating product view...
        </div>
      }
    >
      <ProductDetailClient id={id} />
    </Suspense>
  );
}
