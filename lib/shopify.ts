// lib/shopify.ts
import { GraphQLClient } from 'graphql-request';

// Using hardcoded values for development, should be moved to .env in production
const SHOPIFY_STORE_DOMAIN = '0f98x6-y1.myshopify.com';
const SHOPIFY_STOREFRONT_API_KEY = '0e6169259dc60f6b6c6efec096fb8315';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function shopifyFetch(query: string, variables: any = {}) {
  try {
    return await client.request(query, variables);
  } catch (error: any) {
    console.error('Shopify API error:', JSON.stringify(error, null, 2));
    throw new Error('Could not fetch from Shopify');
  }
}

export async function getProducts(options: { first?: number } | number = 10) {
  // Handle both object and number parameters
  const first = typeof options === 'object' ? options.first || 10 : options;
  
  const query = `
    {
      products(first: ${first}) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.products.edges.map((edge: any) => edge.node);
}

export async function getProductByHandle(handle: string) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { handle });
  return data.productByHandle;
}

export async function createCart(variantId: string, quantity: number) {
  const query = `
    mutation createCart($cartInput: CartInput!) {
      cartCreate(input: $cartInput) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  const variables = {
    cartInput: { lines: [{ quantity, merchandiseId: variantId }] },
  };
  const data = await shopifyFetch(query, variables);
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const query = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { cartId, lines: [{ quantity, merchandiseId: variantId }] };
  const data = await shopifyFetch(query, variables);
  return data.cartLinesAdd.cart;
}

export async function getCart(cartId: string) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { cartId });
  return data.cart;
}
