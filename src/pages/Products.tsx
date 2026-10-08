import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/products";
import { CloseIcon, SearchIcon } from "../components/icons";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import { useSeo } from "../hooks/useSeo";
import { productsMeta } from "../seo/seo";
import type { Product } from "../types/product";

type AvailabilityFilter = "all" | "available" | "sold";
type SortOption = "newest" | "price-asc" | "price-desc";

const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const parseAvailability = (value: string | null): AvailabilityFilter =>
  value === "available" || value === "sold" ? value : "all";

const parseSort = (value: string | null): SortOption =>
  value === "price-asc" || value === "price-desc" ? value : "newest";

const matchesAvailability = (product: Product, availability: AvailabilityFilter) => {
  if (availability === "available") return !product.soldOut;
  if (availability === "sold") return product.soldOut;
  return true;
};

const matchesQuery = (product: Product, query: string) => {
  if (!query) return true;
  const haystack = `${product.name} ${product.description}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
};

const sortProducts = (products: Product[], sort: SortOption): Product[] => {
  if (sort === "price-asc") return [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return [...products].sort((a, b) => b.price - a.price);
  return products;
};

const Products = () => {
  useSeo(productsMeta);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const availability = parseAvailability(searchParams.get("show"));
  const sort = parseSort(searchParams.get("sort"));

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === defaultValue) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const allProducts = products ?? [];
  const trimmedQuery = query.trim();
  const filteredProducts = sortProducts(
    allProducts.filter(
      (product) =>
        matchesAvailability(product, availability) && matchesQuery(product, trimmedQuery),
    ),
    sort,
  );
  const hasActiveFilters = trimmedQuery !== "" || availability !== "all" || sort !== "newest";
  const resultLabel = `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}`;

  return (
    <section className="container-page pt-14 pb-8 sm:pt-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">The collection</p>
        <h1 className="section-title mt-3">Handmade Knives, Swords &amp; Karambits</h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Every knife, sword, and karambit below is fully custom and hand-forged to order by Josh
          Ellison in Chorley, Lancashire — from everyday kitchen knives to one-of-a-kind pieces.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-80">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(event) => updateParam("q", event.target.value, "")}
            placeholder="Search the collection"
            aria-label="Search the collection"
            className="input pr-10 pl-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => updateParam("q", "", "")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-subtle hover:text-fg"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end lg:gap-6">
          <div
            role="group"
            aria-label="Filter by availability"
            className="flex rounded-xs border border-line p-0.5"
          >
            {availabilityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateParam("show", option.value, "all")}
                aria-pressed={availability === option.value}
                className={`rounded-xs px-4 py-2 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition-colors ${
                  availability === option.value
                    ? "bg-ember text-canvas"
                    : "text-muted hover:text-fg"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3">
            <span className="label hidden sm:block">Sort</span>
            <select
              value={sort}
              onChange={(event) => updateParam("sort", event.target.value, "newest")}
              className="input w-auto py-2.5 pr-8"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-5 text-xs tracking-[0.18em] text-subtle uppercase" aria-live="polite">
        {isLoading ? "Loading the collection…" : resultLabel}
      </p>

      {isLoading ? (
        <ProductGridSkeleton
          count={6}
          className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3"
        />
      ) : filteredProducts.length === 0 ? (
        <div className="mt-6 rounded-xs border border-dashed border-line px-6 py-20 text-center">
          <p className="font-display text-3xl font-medium text-fg">Nothing matches that search</p>
          <p className="mt-3 text-sm text-muted">
            Try a different search, or clear the filters to see every piece.
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="btn btn-outline mt-8">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} eager={index < 3} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;
