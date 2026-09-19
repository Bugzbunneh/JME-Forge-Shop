import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/products";
import { slugify } from "../utils/slugify";

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [soldOut, setSoldOut] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate(`/products/${product.slug}`);
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const combinedFiles = [...imageFiles, ...newFiles];
    setImageFiles(combinedFiles);
    setPreviewUrls(combinedFiles.map((file) => URL.createObjectURL(file)));
    event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedPreviewUrl = previewUrls[indexToRemove];
    URL.revokeObjectURL(removedPreviewUrl);

    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(previewUrls.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    const parsedPrice = Number(price);

    if (!trimmedTitle || !description.trim() || Number.isNaN(parsedPrice)) {
      setFormError("Please fill in a title, a valid price, and a description.");
      return;
    }

    mutation.mutate({
      slug: slugify(trimmedTitle) || `product-${Date.now()}`,
      name: trimmedTitle,
      price: parsedPrice,
      description: description.trim(),
      soldOut,
      imageFiles,
    });
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
          {previewUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {previewUrls.map((src, index) => (
                <div key={src} className="relative">
                  <img src={src} alt="" className="h-24 w-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove image"
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center bg-neutral-900 text-white hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
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

        {formError && <p className="text-sm text-red-400">{formError}</p>}
        {mutation.isError && (
          <p className="text-sm text-red-400">
            Something went wrong saving this product. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full border border-white py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? "Saving…" : "Add product"}
        </button>
      </form>
    </section>
  );
};

export default AddProduct;
