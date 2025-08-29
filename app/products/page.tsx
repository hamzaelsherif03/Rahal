import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product-card';

export default async function ProductsPage() {
  const products = await getProducts({ first: 100 });
  
  return (
    <section className="py-10 px-6 md:px-10">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex gap-3">
          <input
            placeholder="Search products"
            className="border rounded-md px-3 py-2"
          />
          <select className="border rounded-md px-3 py-2">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}