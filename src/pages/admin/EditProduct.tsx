import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { fetchProductById, updateProduct } from "../../api/products";
import type { Product } from "../../types/product";

const EditProductForm = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [description, setDescription] = useState(product.description);
  const [soldOut, setSoldOut] = useState(product.soldOut);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", product.slug] });
      navigate("/admin/products");
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const combinedFiles = [...newImageFiles, ...newFiles];
    setNewImageFiles(combinedFiles);
    setPreviewUrls(combinedFiles.map((file) => URL.createObjectURL(file)));
    event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedPreviewUrl = previewUrls[indexToRemove];
    URL.revokeObjectURL(removedPreviewUrl);

    setNewImageFiles(newImageFiles.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(previewUrls.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const parsedPrice = Number(price);

    if (!trimmedName || !description.trim() || Number.isNaN(parsedPrice)) {
      setFormError("Please fill in a name, a valid price, and a description.");
      return;
    }

    mutation.mutate({
      id: product.id,
      slug: product.slug,
      name: trimmedName,
      price: parsedPrice,
      description: description.trim(),
      soldOut,
      newImageFiles,
    });
  };

  const existingImages = product.images ?? [];

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-xl space-y-6">
      <div>
        <label htmlFor="name" className="label">
          Title
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input mt-2"
        />
      </div>

      <div>
        <label htmlFor="price" className="label">
          Price (£)
        </label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="input mt-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="input mt-2"
        />
      </div>

      <div>
        <label className="label">Current images</label>
        {existingImages.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {existingImages.map((image) => (
              <img key={image} src={image} alt="" className="h-24 w-24 rounded-xs object-cover" />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-subtle">No images uploaded — using placeholder.</p>
        )}

        <label htmlFor="images" className="mt-4 label">
          Replace images
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-2 w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-xs file:border file:border-line file:bg-raised file:px-4 file:py-2 file:text-fg"
        />
        {previewUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {previewUrls.map((src, index) => (
              <div key={src} className="relative">
                <img src={src} alt="" className="h-24 w-24 rounded-xs object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Remove image"
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-raised text-fg hover:bg-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-subtle">
          Choosing new images replaces all existing ones for this product.
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={soldOut}
          onChange={(event) => setSoldOut(event.target.checked)}
          className="h-4 w-4 accent-ember"
        />
        Sold out
      </label>

      {formError && <p className="alert-error">{formError}</p>}
      {mutation.isError && (
        <p className="alert-error">Something went wrong saving this product. Please try again.</p>
      )}

      <button type="submit" disabled={mutation.isPending} className="btn btn-primary">
        {mutation.isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
};

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-by-id", id],
    queryFn: () => fetchProductById(id ?? ""),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <p className="text-subtle">Loading…</p>;
  }

  if (!product) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <section>
      <h1 className="font-display text-4xl font-medium text-fg">Edit product</h1>
      <EditProductForm product={product} />
    </section>
  );
};

export default EditProduct;
