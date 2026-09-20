import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchOrders } from "../api/orders";
import { fetchProfile, updateProfile } from "../api/profile";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";
import ProductImage from "../components/ProductImage";

type Tab = "orders" | "personal";

const OrdersTab = ({ userId }: { userId: string }) => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId),
  });

  if (isLoading) {
    return <p className="text-neutral-500">Loading…</p>;
  }

  if (!orders || orders.length === 0) {
    return <p className="text-neutral-400">You haven't placed any orders yet.</p>;
  }

  return (
    <ul className="space-y-6">
      {orders.map((order) => (
        <li key={order.id} className="border border-neutral-700 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white">Order #{order.id.slice(0, 8)}</span>
            <span className="text-neutral-400 capitalize">{order.status}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <ul className="mt-3 space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <ProductImage
                  slug={item.productId ?? item.id}
                  images={item.productImages ?? undefined}
                  alt={item.productName ?? "Unknown product"}
                  className="h-12 w-12 shrink-0 object-cover"
                />
                <span className="text-sm text-neutral-200">
                  {item.productName ?? "Unknown product"}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-sm text-neutral-300">
            {order.items.length} item{order.items.length === 1 ? "" : "s"} — £
            {order.total.toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
};

const PersonalInfoTab = ({ userId, email }: { userId: string; email: string | undefined }) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
  });

  if (isLoading) {
    return <p className="text-neutral-500">Loading…</p>;
  }

  return (
    <PersonalInfoForm
      key={profile?.fullName ?? ""}
      userId={userId}
      email={email}
      initialFullName={profile?.fullName ?? ""}
    />
  );
};

const PersonalInfoForm = ({
  userId,
  email,
  initialFullName,
}: {
  userId: string;
  email: string | undefined;
  initialFullName: string;
}) => {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(initialFullName);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: () => updateProfile(userId, fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      setSavedMessage("Saved.");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSavedMessage(null);
    saveMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-6">
      <div>
        <label className="block text-xs uppercase tracking-widest text-neutral-400">Email</label>
        <p className="mt-2 text-white">{email}</p>
      </div>

      <div>
        <label
          htmlFor="full-name"
          className="block text-xs uppercase tracking-widest text-neutral-400"
        >
          Full name
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
        />
      </div>

      {savedMessage && <p className="text-sm text-neutral-300">{savedMessage}</p>}
      {saveMutation.isError && (
        <p className="text-sm text-red-400">Could not save your changes. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={saveMutation.isPending}
        className="border border-white px-6 py-2 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saveMutation.isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
};

const Account = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState<Tab>("orders");
  const [searchParams] = useSearchParams();
  const checkoutSucceeded = searchParams.get("checkout") === "success";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-light tracking-tight text-white sm:text-3xl">Your account</h1>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-xs uppercase tracking-widest text-neutral-400 underline hover:text-white"
        >
          Sign out
        </button>
      </div>

      {checkoutSucceeded && (
        <p className="mt-6 border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-neutral-200">
          Thanks for your order! It'll show up below shortly.
        </p>
      )}

      <div className="mt-8 flex gap-8 border-b border-neutral-700">
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`pb-3 text-xs uppercase tracking-widest transition-colors ${
            tab === "orders"
              ? "border-b-2 border-white text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          onClick={() => setTab("personal")}
          className={`pb-3 text-xs uppercase tracking-widest transition-colors ${
            tab === "personal"
              ? "border-b-2 border-white text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Personal information
        </button>
      </div>

      <div className="mt-8">
        {tab === "orders" ? (
          <OrdersTab userId={user.id} />
        ) : (
          <PersonalInfoTab userId={user.id} email={user.email} />
        )}
      </div>
    </section>
  );
};

export default Account;
