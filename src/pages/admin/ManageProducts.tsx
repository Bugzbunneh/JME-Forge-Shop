import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteProduct, fetchProducts } from "../../api/products";
import ProductImage from "../../components/ProductImage";
import { formatPrice } from "../../utils/formatPrice";

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-medium text-fg">Manage products</h1>
        <Link to="/addproduct" className="btn btn-primary">
          Add product
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-3" aria-hidden>
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
        </div>
      ) : !products || products.length === 0 ? (
        <p className="mt-8 text-muted">No products yet.</p>
      ) : (
        <div className="card mt-8 overflow-x-auto px-5 py-2">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <ProductImage
                      slug={product.slug}
                      images={product.images}
                      alt={product.name}
                      className="h-12 w-12 rounded-xs object-cover"
                    />
                  </td>
                  <td className="font-medium text-fg">{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] uppercase ${
                        product.soldOut
                          ? "border-line text-subtle"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {product.soldOut ? "Sold out" : "In stock"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-4">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="link-underline text-fg"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleteMutation.isPending}
                        className="link-underline hover:text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteMutation.isError && (
        <p className="alert-error mt-4">Could not delete that product. Please try again.</p>
      )}
    </section>
  );
};

export default ManageProducts;
