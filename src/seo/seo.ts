import { siteConfig } from "../config/site";
import type { Product } from "../types/product";

export const siteName = siteConfig.name;

export const homeMeta = {
  title: "JME Forge Shop | Handmade Custom Knives & Swords, Chorley, Lancashire",
  description:
    "Hand-forged custom knives, kitchen knives, and swords made by Josh Ellison in Chorley, Lancashire. Every piece is one of a kind.",
};

export const productsMeta = {
  title: "Handmade Knives, Swords & Karambits | JME Forge Shop",
  description:
    "Shop hand-forged custom knives, kitchen knives, swords, and karambits made by Josh Ellison in Chorley, Lancashire, UK.",
};

export const getProductMeta = (product: Pick<Product, "name" | "description">) => ({
  title: `${product.name} | ${siteName}`,
  description: `${product.description} Hand-forged by Josh Ellison in Chorley, Lancashire, UK.`,
});

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteName,
  description: homeMeta.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chorley",
    addressRegion: "Lancashire",
    addressCountry: "GB",
  },
  areaServed: "North West England",
  sameAs: [siteConfig.instagramUrl],
};

export const getProductJsonLd = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images && product.images.length > 0 ? product.images : undefined,
  brand: { "@type": "Brand", name: siteName },
  offers: {
    "@type": "Offer",
    priceCurrency: "GBP",
    price: product.price.toFixed(2),
    availability: product.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
  },
});
