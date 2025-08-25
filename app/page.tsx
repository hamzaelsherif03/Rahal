"use client"

import { useMemo, useState } from "react"
import { UserMenu } from "@/components/auth/user-menu"
import { WishlistButton } from "@/components/wishlist/wishlist-button"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { ReviewForm } from "@/components/reviews/review-form"
import { SizeGuideModal } from "@/components/size-guide/size-guide-modal"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"

// --- Mock Catalog ---
const PRODUCTS = [
  {
    id: "pleated-midi-purple",
    title: "Royal Purple Pleated Midi",
    price: 89,
    compareAt: 119,
    rating: 4.8,
    tags: ["new", "bestseller"],
    colors: ["Royal Purple", "Deep Magenta", "Blush Pink"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/elegant-purple-pleated-midi-skirt-flowing-fabric.png",
      "/purple-pleated-skirt-detail-close-up-texture.png",
    ],
    description:
      "Exquisite pleated midi in rich royal purple. Premium fabric with elegant drape, elastic waistband for comfort, and timeless silhouette that moves gracefully with you.",
    collection: "Signature Collection",
  },
  {
    id: "magenta-maxi-pleated",
    title: "Magenta Dreams Maxi",
    price: 149,
    compareAt: 189,
    rating: 4.9,
    tags: ["limited", "premium"],
    colors: ["Deep Magenta", "Fuchsia", "Rose Gold"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "/flowing-magenta-pleated-maxi-skirt-luxury-fabric.png",
      "/magenta-pleated-skirt-movement-outdoor-setting.png",
    ],
    description:
      "Luxurious pleated maxi in deep magenta. Crafted from premium fabric with intricate pleating that creates beautiful movement and an elegant silhouette.",
    collection: "Evening Elegance",
  },
  {
    id: "blush-mini-pleated",
    title: "Blush Pink Mini Pleats",
    price: 69,
    rating: 4.6,
    tags: ["casual", "feminine"],
    colors: ["Blush Pink", "Soft Lavender", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/cute-blush-pink-pleated-mini-skirt-feminine-style.png", "/pink-pleated-mini-skirt-casual-styling.png"],
    description:
      "Playful pleated mini in soft blush pink. Perfect for casual elegance with its flirty length and feminine pleating that adds movement to every step.",
    collection: "Everyday Chic",
  },
  {
    id: "lavender-midi-pleated",
    title: "Lavender Mist Midi",
    price: 94,
    rating: 4.7,
    tags: ["romantic", "spring"],
    colors: ["Soft Lavender", "Lilac", "Dusty Rose"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "/romantic-lavender-pleated-midi-skirt-spring-fashio.png",
      "/lavender-pleated-skirt-flowing-fabric-detail.png",
    ],
    description:
      "Romantic pleated midi in soft lavender. Delicate pleating creates a dreamy silhouette perfect for spring occasions and feminine styling.",
    collection: "Romantic Collection",
  },
]

const CURRENCIES = ["USD", "EUR", "EGP", "GBP"] // quick selector like Shopify's storefront

function money(n, currency) {
  const symbol = { USD: "$", EUR: "€", EGP: "E£", GBP: "£" }[currency] || "$"
  return `${symbol}${n.toFixed(2)}`
}

function classNames(...xs) {
  return xs.filter(Boolean).join(" ")
}

// --- Mini Router ---
function useRouter() {
  const [route, setRoute] = useState({ name: "home" })
  const push = (r) => setRoute(r)
  return { route, push }
}

export default function RahalTheme() {
  const { route, push } = useRouter()
  const [currency, setCurrency] = useState("USD")
  const [cart, setCart] = useState([]) // {id, title, price, qty, color, size, image}

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])

  const shipping = subtotal > 150 ? 0 : subtotal === 0 ? 0 : 9
  const total = subtotal + shipping

  function addToCart(p, sel) {
    const key = `${p.id}-${sel.color}-${sel.size}`
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.key === key)
      if (idx > -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [
        ...prev,
        {
          key,
          id: p.id,
          title: p.title,
          price: p.price,
          qty: 1,
          color: sel.color,
          size: sel.size,
          image: p.images[0],
        },
      ]
    })
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((x) => x.key !== key))
  }

  function setQty(key, qty) {
    setCart((prev) => prev.map((x) => (x.key === key ? { ...x, qty: Math.max(1, qty) } : x)))
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="text-center text-sm bg-primary text-primary-foreground py-3 font-body tracking-wide">
          Complimentary shipping on orders over {money(150, currency)} • Effortless returns within 30 days
        </div>

        <header className="flex items-center justify-between px-8 md:px-16 py-8 border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur-md z-30">
          <div className="flex items-center gap-12">
            <button
              onClick={() => push({ name: "home" })}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src="/rahal-logo.png" alt="Rahal Logo" className="h-12 w-12 object-contain rounded-full" />
            </button>
            <nav className="hidden md:flex gap-10 text-base font-body font-medium">
              <button
                onClick={() => push({ name: "collection", handle: "all" })}
                className="hover:text-primary/70 transition-colors tracking-wide uppercase text-sm"
              >
                Collections
              </button>
              <button
                onClick={() => push({ name: "collection", handle: "Evening Elegance" })}
                className="hover:text-primary/70 transition-colors tracking-wide uppercase text-sm"
              >
                Evening
              </button>
              <button
                onClick={() => push({ name: "collection", handle: "Everyday Chic" })}
                className="hover:text-primary/70 transition-colors tracking-wide uppercase text-sm"
              >
                Everyday
              </button>
              <button
                onClick={() => push({ name: "about" })}
                className="hover:text-primary/70 transition-colors tracking-wide uppercase text-sm"
              >
                Atelier
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <select
              className="border border-border rounded-none px-4 py-2 text-sm bg-background font-body tracking-wide uppercase"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <UserMenu />
            <button
              className="relative p-3 hover:bg-accent/50 transition-all duration-300 ease-out rounded-full"
              onClick={() => push({ name: "cart" })}
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center font-body">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Router Views */}
        {route.name === "home" && (
          <HomeView
            onShop={() => push({ name: "collection", handle: "all" })}
            onOpen={(p) => push({ name: "product", id: p.id })}
          />
        )}
        {route.name === "collection" && (
          <CollectionView handle={route.handle} onOpen={(p) => push({ name: "product", id: p.id })} />
        )}
        {route.name === "product" && (
          <ProductView
            id={route.id}
            currency={currency}
            onBack={() => push({ name: "collection", handle: "all" })}
            onAdd={addToCart}
          />
        )}
        {route.name === "cart" && (
          <CartView
            cart={cart}
            currency={currency}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onQty={setQty}
            onRemove={removeItem}
            onCheckout={() => push({ name: "checkout" })}
          />
        )}
        {route.name === "checkout" && (
          <CheckoutView
            cart={cart}
            currency={currency}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onPlace={() => push({ name: "order-confirmation" })}
          />
        )}
        {route.name === "order-confirmation" && <ThankYou onShop={() => push({ name: "collection", handle: "all" })} />}

        <footer className="border-t border-border/30 py-20 px-8 md:px-16 text-sm text-muted-foreground bg-card/50">
          <div className="grid md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img src="/rahal-logo.png" alt="Rahal Logo" className="h-16 w-16 object-contain rounded-full" />
                <div className="text-2xl font-heading font-bold text-primary tracking-tight">RAHAL</div>
              </div>
              <p className="text-muted-foreground leading-relaxed font-body">
                Curated exclusively for the feminine soul who values timeless elegance and exquisite pleated designs.
                Each piece tells a story of grace and sophistication.
              </p>
            </div>
            <div className="space-y-4">
              <div className="font-heading font-semibold text-foreground tracking-wide uppercase text-sm">
                Collections
              </div>
              <ul className="space-y-3 font-body">
                <li>
                  <button
                    className="hover:text-primary transition-colors"
                    onClick={() => push({ name: "collection", handle: "Signature Collection" })}
                  >
                    Signature Collection
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-primary transition-colors"
                    onClick={() => push({ name: "collection", handle: "Evening Elegance" })}
                  >
                    Evening Elegance
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-primary transition-colors"
                    onClick={() => push({ name: "collection", handle: "Everyday Chic" })}
                  >
                    Everyday Chic
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-primary transition-colors"
                    onClick={() => push({ name: "collection", handle: "Romantic Collection" })}
                  >
                    Romantic Collection
                  </button>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-heading font-semibold text-foreground tracking-wide uppercase text-sm">
                Client Care
              </div>
              <ul className="space-y-3 font-body">
                <li>
                  <button
                    className="hover:text-primary transition-colors"
                    onClick={() => alert("Email: concierge@rahal.com")}
                  >
                    Contact Concierge
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-primary transition-colors"
                    onClick={() => alert("Complimentary returns within 30 days")}
                  >
                    Returns & Exchanges
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors" onClick={() => alert("Size guide opens")}>
                    Size Consultation
                  </button>
                </li>
                <li>
                  <button className="hover:text-primary transition-colors" onClick={() => alert("Care instructions")}>
                    Care Instructions
                  </button>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="font-heading font-semibold text-foreground tracking-wide uppercase text-sm">
                Stay Connected
              </div>
              <NewsletterSignup />
            </div>
          </div>
          <div className="text-center text-muted-foreground/70 mt-16 pt-8 border-t border-border/20 font-body tracking-wide">
            © {new Date().getFullYear()} RAHAL. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  )
}

// --- Views ---
function HomeView({ onShop, onOpen }) {
  return (
    <>
      <section className="relative flex flex-col items-center justify-center text-center py-32 md:py-48 px-8 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light tracking-tight text-foreground leading-[0.9]">
            Feminine
            <br />
            <span className="font-bold text-primary">Grace</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-body leading-relaxed tracking-wide">
            Each pleated creation is meticulously crafted to embody feminine elegance and grace, designed for the woman
            who appreciates the artistry of beautiful movement.
          </p>
          <div className="pt-8">
            <button
              onClick={() => {
                onShop()
              }}
              className="bg-primary text-primary-foreground px-12 py-4 font-body font-medium text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 ease-out hover:scale-[1.02] luxury-shadow-lg rounded-full"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-light text-center mb-16 tracking-tight text-primary">
            Featured Pieces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => onOpen(p)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-8 md:px-16 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      <section className="py-24 px-8 md:px-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-heading font-light tracking-tight text-primary">Our Philosophy</h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            We believe in the poetry of pleated fabric and the power of feminine grace. Every piece in our collection
            celebrates the art of movement, crafted with meticulous attention to detail for the woman who understands
            that true elegance lies in the beauty of flowing fabric.
          </p>
        </div>
      </section>
    </>
  )
}

function CollectionView({ handle, onOpen }) {
  const items = useMemo(() => {
    if (!handle || handle === "all") return PRODUCTS
    return PRODUCTS.filter((p) => p.collection === handle)
  }, [handle])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
    }
  }

  return (
    <section className="py-10 px-6 md:px-10">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl font-bold">{handle === "all" ? "All Skirts" : handle}</h1>
        <div className="flex gap-3">
          <input
            placeholder="Search skirts"
            className="border rounded-md px-3 py-2"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select className="border rounded-md px-3 py-2">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
            <option>Newest</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={() => onOpen(p)} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product, onOpen }) {
  const handleProductClick = () => {
    onOpen()
  }

  return (
    <div className="group transition-all duration-300 ease-out">
      <div className="relative overflow-hidden">
        <button onClick={handleProductClick} className="block w-full text-left">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-96 object-cover transition-all duration-300 ease-out group-hover:scale-105"
          />
        </button>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <WishlistButton
            productId={product.id}
            className="bg-background/90 backdrop-blur-sm hover:bg-background luxury-shadow"
          />
        </div>
      </div>
      <button onClick={handleProductClick} className="block w-full text-left">
        <div className="pt-6 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-body">
            {product.tags.map((t) => (
              <span key={t} className="border border-border px-3 py-1">
                {t}
              </span>
            ))}
          </div>
          <div className="font-heading font-medium text-lg tracking-wide">{product.title}</div>
          <div className="text-muted-foreground font-body text-sm tracking-wide uppercase">{product.collection}</div>
          <div className="font-body font-semibold text-lg">${product.price}</div>
        </div>
      </button>
    </div>
  )
}

function ProductView({ id, onBack, onAdd, currency }) {
  const p = PRODUCTS.find((x) => x.id === id)
  const [image, setImage] = useState(0)
  const [color, setColor] = useState(p.colors[0])
  const [size, setSize] = useState(p.sizes[0])

  return (
    <>
      <section className="py-10 px-6 md:px-10">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          ← Back to shop
        </button>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <div className="relative">
              <img
                src={p.images[image] || "/placeholder.svg"}
                alt={p.title}
                className="w-full h-[520px] object-cover rounded-2xl"
              />
              <div className="absolute top-4 right-4">
                <WishlistButton productId={p.id} className="bg-white/80 backdrop-blur-sm hover:bg-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImage(i)}
                  className={classNames(
                    "w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors",
                    i === image ? "border-primary" : "border-border hover:border-muted-foreground",
                  )}
                >
                  <img src={img || "/placeholder.svg"} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-heading font-bold">{p.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="text-xl font-bold">{money(p.price, currency)}</div>
              {p.compareAt && <div className="line-through text-muted-foreground">{money(p.compareAt, currency)}</div>}
              <div className="text-yellow-500" aria-label={`Rating ${p.rating}`}>
                {"★".repeat(Math.round(p.rating))}
              </div>
            </div>
            <p className="text-muted-foreground mt-4 leading-relaxed">{p.description}</p>

            <div className="mt-6">
              <div className="font-semibold mb-3">Color</div>
              <div className="flex gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={classNames(
                      "px-4 py-2 rounded-full border-2 transition-all font-medium",
                      c === color
                        ? "border-primary text-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Size</div>
                <SizeGuideModal />
              </div>
              <div className="flex gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={classNames(
                      "px-4 py-2 rounded-full border-2 transition-all font-medium min-w-[3rem]",
                      s === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => onAdd(p, { color, size })}
                className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
              <button className="flex-1 border-2 border-foreground px-6 py-4 rounded-xl font-semibold hover:bg-foreground hover:text-background transition-colors">
                Buy Now
              </button>
            </div>

            <div className="mt-6 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-4 text-center">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Complimentary shipping over {money(150, currency)}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  30-day returns
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div>
            <ReviewsList productId={p.id} />
          </div>
          <div>
            <ReviewForm productId={p.id} />
          </div>
        </div>

        {/* More like this */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6">You might also like</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.filter((x) => x.id !== p.id)
              .slice(0, 4)
              .map((pp) => (
                <div key={pp.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <img src={pp.images[0] || "/placeholder.svg"} alt={pp.title} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <div className="font-medium text-sm">{pp.title}</div>
                    <div className="font-bold text-sm">${pp.price}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

function CartView({ cart, subtotal, shipping, total, currency, onQty, onRemove, onCheckout }) {
  return (
    <section className="py-10 px-6 md:px-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty. Time to fix that.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.key} className="flex gap-4 border rounded-xl p-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-gray-500">{money(item.price, currency)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQty(item.key, item.qty - 1)}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => onQty(item.key, item.qty + 1)}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="font-semibold">Total</div>
                    <div className="font-bold text-sm">{money(item.price * item.qty, currency)}</div>
                  </div>
                  <button
                    onClick={() => onRemove(item.key)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-6 rounded-lg space-y-4">
            <div className="flex justify-between">
              <div className="font-semibold">Subtotal</div>
              <div className="font-bold text-sm">{money(subtotal, currency)}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-semibold">Shipping</div>
              <div className="font-bold text-sm">{money(shipping, currency)}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-semibold">Total</div>
              <div className="font-bold text-sm">{money(total, currency)}</div>
            </div>
            <button
              onClick={onCheckout}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function CheckoutView({ cart, subtotal, shipping, total, currency, onPlace }) {
  return (
    <section className="py-10 px-6 md:px-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-4 border rounded-xl p-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-28 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-500">{money(item.price, currency)}</div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="font-semibold">Quantity</div>
                  <div className="font-bold text-sm">{item.qty}</div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="font-semibold">Total</div>
                  <div className="font-bold text-sm">{money(item.price * item.qty, currency)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-6 rounded-lg space-y-4">
          <div className="flex justify-between">
            <div className="font-semibold">Subtotal</div>
            <div className="font-bold text-sm">{money(subtotal, currency)}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-semibold">Shipping</div>
            <div className="font-bold text-sm">{money(shipping, currency)}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-semibold">Total</div>
            <div className="font-bold text-sm">{money(total, currency)}</div>
          </div>
          <button
            onClick={onPlace}
            className="bg-primary text-primary-foreground px-6 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
    </section>
  )
}

function ThankYou({ onShop }) {
  return (
    <section className="py-10 px-6 md:px-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Thank You for Your Order!</h1>
      <p className="text-gray-600 mb-8">We appreciate your purchase. Enjoy your new skirt!</p>
      <button
        onClick={onShop}
        className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
      >
        Shop More Skirts
      </button>
    </section>
  )
}
