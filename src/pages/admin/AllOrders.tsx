import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders } from "../../api/orders";
import ProductImage from "../../components/ProductImage";

const AllOrders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAllOrders,
  });

  return (
    <section>
      <h1 className="text-2xl font-light tracking-tight text-white">All orders</h1>

      {isLoading ? (
        <p className="mt-8 text-neutral-500">Loading…</p>
      ) : !orders || orders.length === 0 ? (
        <p className="mt-8 text-neutral-400">No orders have been placed yet.</p>
      ) : (
        <table className="mt-8 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-700 text-xs tracking-widest text-neutral-500 uppercase">
              <th className="py-3 pr-4 font-normal">Order</th>
              <th className="py-3 pr-4 font-normal">Customer</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-4 font-normal">Products</th>
              <th className="py-3 pr-4 font-normal">Total</th>
              <th className="py-3 pr-4 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-800 text-neutral-300">
                <td className="py-3 pr-4">{order.id.slice(0, 8)}</td>
                <td className="py-3 pr-4">{order.userId.slice(0, 8)}</td>
                <td className="py-3 pr-4 capitalize">{order.status}</td>
                <td className="py-3 pr-4">
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <ProductImage
                          slug={item.productId ?? item.id}
                          images={item.productImages ?? undefined}
                          alt={item.productName ?? "Unknown product"}
                          className="h-10 w-10 shrink-0 object-cover"
                        />
                        <span>{item.productName ?? "Unknown product"}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 pr-4">£{order.total.toFixed(2)}</td>
                <td className="py-3 pr-4">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AllOrders;
