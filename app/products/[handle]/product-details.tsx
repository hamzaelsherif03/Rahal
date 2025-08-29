'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { useRouter } from 'next/navigation';

export default function ProductDetails({ product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.edges[0]?.node.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // Format price for display
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode || 'USD'
  }).format(price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      const cart = await addToCart(selectedVariantId, quantity);
      if (cart) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <a href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to all products
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images.edges[0]?.node.url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.edges.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                  <img 
                    src={image.node.url} 
                    alt={`${product.title} - View ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-heading">{product.title}</h1>
              <p className="text-xl mt-2 font-medium text-primary">{formattedPrice}</p>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available' }} />
            </div>
            
            <form onSubmit={handleAddToCart} className="space-y-6">
              <div>
                <label htmlFor="variant" className="block text-sm font-medium mb-2">
                  Select Variant
                </label>
                <select 
                  id="variant"
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background"
                >
                  {product.variants.edges.map((edge) => (
                    <option key={edge.node.id} value={edge.node.id}>
                      {edge.node.title} - {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: edge.node.priceV2.currencyCode || 'USD'
                      }).format(parseFloat(edge.node.priceV2.amount))}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full border border-input rounded-md px-3 py-2 bg-background"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            </form>
            
            <div className="pt-6 border-t border-border/30">
              <h3 className="text-sm font-medium mb-2">Product Details</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Premium quality materials</li>
                <li>Ethically manufactured</li>
                <li>Free shipping on orders over $150</li>
                <li>30-day returns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}