import { getProductByHandle } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import ProductDetails from './product-details';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}