'use client';

import Link from 'next/link';
import { useState } from 'react';

export function CartView({ cart }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate totals
  const subtotal = cart?.lines?.edges?.reduce(
    (total, edge) => total + parseFloat(edge.node.merchandise.priceV2.amount) * edge.node.quantity,
    0
  ) || 0;
  
  const shipping = subtotal > 150 ? 0 : subtotal === 0 ? 0 : 9;
  const total = subtotal + shipping;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const handleCheckout = () => {
    setIsLoading(true);
    // Redirect to Shopify checkout
    window.location.href = cart.checkoutUrl;
  };

  if (!cart || !cart.lines?.edges?.length) {
    return (
      <div className="text-center py-20 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-heading mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add items to your cart to continue shopping</p>
        <Link 
          href="/products" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h1 className="text-3xl font-bold font-heading mb-8">Your Shopping Cart</h1>
      
      <div className="space-y-6 mb-8">
        {cart.lines.edges.map((edge) => (
          <div key={edge.node.id} className="flex items-center justify-between border-b border-border/30 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                {edge.node.merchandise.image && (
                  <img 
                    src={edge.node.merchandise.image.url} 
                    alt={edge.node.merchandise.product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="font-medium">{edge.node.merchandise.product.title}</h2>
                <p className="text-sm text-muted-foreground">{edge.node.merchandise.title}</p>
                <p className="text-sm mt-1">Quantity: {edge.node.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-primary">
              {formatCurrency(parseFloat(edge.node.merchandise.priceV2.amount))}
            </p>
          </div>
        ))}
      </div>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          {shipping > 0 && (
            <div className="text-xs text-muted-foreground">
              Free shipping on orders over {formatCurrency(150)}
            </div>
          )}
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t border-border/30">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">
        <Link 
          href="/products" 
          className="text-center px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}