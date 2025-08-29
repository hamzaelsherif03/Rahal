import Link from 'next/link';

export function ProductCard({ product, onOpen }) {
  // Handle both Shopify product format and internal product format
  const isShopifyProduct = product.images && product.images.edges;
  
  // Get image URL based on product format
  const imageUrl = isShopifyProduct 
    ? product.images.edges[0]?.node.url || '/placeholder.svg'
    : product.images?.[0] || '/placeholder.svg';
    
  // Get price based on product format
  const price = isShopifyProduct
    ? parseFloat(product.priceRange?.minVariantPrice?.amount || 0).toFixed(2)
    : product.price?.toFixed(2);
    
  // Get product handle/id for link
  const productLink = isShopifyProduct
    ? `/products/${product.handle}`
    : `/products/${product.id}`;
    
  const handleClick = (e) => {
    if (onOpen) {
      e.preventDefault();
      onOpen();
    }
  };
  
  const LinkComponent = onOpen ? 'button' : Link;
  const linkProps = onOpen 
    ? { onClick: handleClick, className: "block w-full text-left" }
    : { href: productLink, className: "block w-full text-left" };

  return (
    <div className="group transition-all duration-300 ease-out">
      <div className="relative overflow-hidden">
        <LinkComponent {...linkProps}>
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-96 object-cover transition-all duration-300 ease-out group-hover:scale-105"
          />
        </LinkComponent>
      </div>
      <LinkComponent {...linkProps}>
        <div className="pt-6 space-y-2">
          <div className="font-heading font-medium text-lg tracking-wide">{product.title}</div>
          <div className="font-body font-semibold text-lg">${price}</div>
        </div>
      </LinkComponent>
    </div>
  );
}