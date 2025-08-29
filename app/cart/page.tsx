import { getCart } from '@/lib/shopify';
import { cookies } from 'next/headers';
import { CartView } from './cart-view';

export default async function CartPage() {
  const cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartView cart={cart} />;
}