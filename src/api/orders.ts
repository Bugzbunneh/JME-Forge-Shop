import { supabase } from "../lib/supabaseClient";

export interface OrderItem {
  id: string;
  productId: string | null;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItemRow {
  id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
}

interface OrderRow {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: OrderItemRow[];
}

const fromItemRow = (row: OrderItemRow): OrderItem => {
  const item: OrderItem = {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
  };
  return item;
};

const fromOrderRow = (row: OrderRow): Order => {
  const items = row.order_items.map(fromItemRow);
  const order: Order = {
    id: row.id,
    status: row.status,
    total: row.total,
    createdAt: row.created_at,
    items,
  };
  return order;
};

export const fetchOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total, created_at, order_items(id, product_id, quantity, unit_price)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const orderRows = data as OrderRow[];
  const orders = orderRows.map(fromOrderRow);
  return orders;
};
