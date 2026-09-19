import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteProduct, fetchProducts } from "../../api/products";
import ProductImage from "../../components/ProductImage";

const ManageProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-tight text-white">Manage products</h1>
        <Link
          to="/addproduct"
          className="border border-white px-4 py-2 text-xs uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900"
        >
          Add product
        </Link>
      </div>

      {isLoading ? (
        <p className="mt-8 text-neutral-500">Loading…</p>
      ) : !products || products.length === 0 ? (
        <p className="mt-8 text-neutral-400">No products yet.</p>
      ) : (
        <table className="mt-8 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-700 text-xs tracking-widest text-neutral-500 uppercase">
              <th className="py-3 pr-4 font-normal">Image</th>
              <th className="py-3 pr-4 font-normal">Name</th>
              <th className="py-3 pr-4 font-normal">Price</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-neutral-800 text-neutral-300">
                <td className="py-3 pr-4">
                  <ProductImage
                    slug={product.slug}
                    images={product.images}
                    className="h-12 w-12 object-cover"
                  />
                </td>
                <td className="py-3 pr-4">{product.name}</td>
                <td className="py-3 pr-4">£{product.price.toFixed(2)}</td>
                <td className="py-3 pr-4">{product.soldOut ? "Sold out" : "In stock"}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-4">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="text-neutral-400 underline hover:text-white"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleteMutation.isPending}
                      className="text-neutral-400 underline hover:text-white disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deleteMutation.isError && (
        <p className="mt-4 text-sm text-red-400">
          Could not delete that product. Please try again.
        </p>
      )}
    </section>
  );
};

export default ManageProducts;
