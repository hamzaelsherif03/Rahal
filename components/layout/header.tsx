'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';

export function Header() {
  const { cart } = useCart();

  return (
    <header className="flex items-center justify-between px-8 md:px-16 py-8 border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur-md z-30">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/rahal-logo.png" alt="Rahal Logo" className="h-12 w-12 object-contain rounded-full" />
        </Link>
        <nav className="hidden md:flex gap-10 text-base font-body font-medium">
          <Link href="/products" className="hover:text-primary/70 transition-colors tracking-wide uppercase text-sm">
            Collections
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/cart" className="relative p-3 hover:bg-accent/50 transition-all duration-300 ease-out rounded-full" aria-label="Shopping cart">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          {cart && cart.lines.edges.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center font-body">
              {cart.lines.edges.reduce((acc, edge) => acc + edge.node.quantity, 0)}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}