import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "../../api/orders";
import ProductImage from "../../components/ProductImage";
import { formatPrice } from "../../utils/formatPrice";

const AllOrders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAllOrders,
  });

  return (
    <section>
      <h1 className="font-display text-4xl font-medium text-fg">All orders</h1>

      {isLoading ? (
        <div className="mt-8 space-y-3" aria-hidden>
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
        </div>
      ) : !orders || orders.length === 0 ? (
        <p className="mt-8 text-muted">No orders have been placed yet.</p>
      ) : (
        <div className="card mt-8 overflow-x-auto px-5 py-2">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Products</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-fg">{order.id.slice(0, 8)}</td>
                  <td>{order.userId.slice(0, 8)}</td>
                  <td className="capitalize">{order.status}</td>
                  <td>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <ProductImage
                            slug={item.productId ?? item.id}
                            images={item.productImages ?? undefined}
                            alt={item.productName ?? "Unknown product"}
                            className="h-10 w-10 shrink-0 rounded-xs object-cover"
                          />
                          <span>{item.productName ?? "Unknown product"}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="text-fg">{formatPrice(order.total)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AllOrders;
