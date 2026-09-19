import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products as staticProducts } from "../data/products";
import { useAddedProductsStore } from "../stores/useAddedProductsStore";
import type { Product } from "../types/product";
import { slugify } from "../utils/slugify";

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddProduct = () => {
  const navigate = useNavigate();
  const addProduct = useAddedProductsStore((state) => state.addProduct);
  const addedProducts = useAddedProductsStore((state) => state.products);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("New Arrivals");
  const [soldOut, setSoldOut] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const dataUrls = await Promise.all(Array.from(files).map(readFileAsDataUrl));
    setImages(dataUrls);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const parsedPrice = Number(price);

    if (!trimmedTitle || !description.trim() || Number.isNaN(parsedPrice)) {
      setError("Please fill in a title, a valid price, and a description.");
      return;
    }

    const baseSlug = slugify(trimmedTitle) || "product";
    const existingSlugs = new Set([
      ...staticProducts.map((product) => product.slug),
      ...addedProducts.map((product) => product.slug),
    ]);
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      slug,
      name: trimmedTitle,
      price: parsedPrice,
      category: category.trim() || "New Arrivals",
      description: description.trim(),
      soldOut,
      images,
    };

    addProduct(newProduct);
    navigate(`/products/${slug}`);
  };

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight text-white">Add a product</h1>
      <p className="mt-2 text-sm text-neutral-400">
        This page is not linked anywhere in the site navigation.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Price (£)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="images"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Images
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-2 w-full text-sm text-neutral-400 file:mr-4 file:border file:border-neutral-700 file:bg-neutral-800 file:px-4 file:py-2 file:text-white"
          />
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((src, index) => (
                <img key={index} src={src} alt="" className="h-16 w-16 object-cover" />
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-neutral-500">
            No image? A placeholder graphic will be used instead.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={soldOut}
            onChange={(event) => setSoldOut(event.target.checked)}
            className="h-4 w-4"
          />
          Sold out
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full border border-white py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900"
        >
          Add product
        </button>
      </form>
    </section>
  );
};

export default AddProduct;
