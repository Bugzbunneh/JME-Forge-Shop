import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchOrders } from "../api/orders";
import { fetchProfile, updateProfile } from "../api/profile";
import { ArrowRightIcon, CheckIcon } from "../components/icons";
import ProductImage from "../components/ProductImage";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";
import { formatPrice } from "../utils/formatPrice";

type Tab = "orders" | "personal";

const tabs: { value: Tab; label: string }[] = [
  { value: "orders", label: "Orders" },
  { value: "personal", label: "Personal information" },
];

const statusBadgeClasses = (status: string) =>
  status === "paid"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-line text-muted";

const OrdersTab = ({ userId }: { userId: string }) => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4" aria-hidden>
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xs border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-3xl font-medium text-fg">No orders yet</p>
        <p className="mt-3 text-sm text-muted">
          When you buy a piece from the forge, it will appear here.
        </p>
        <Link to="/products" className="btn btn-primary mt-8">
          Browse the shop
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {orders.map((order) => {
        const itemCountLabel = `${order.items.length} item${order.items.length === 1 ? "" : "s"}`;
        const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return (
          <li key={order.id} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-fg">Order #{order.id.slice(0, 8)}</p>
                <p className="mt-1 text-xs text-subtle">{orderDate}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] uppercase ${statusBadgeClasses(order.status)}`}
              >
                {order.status}
              </span>
            </div>

            <ul className="mt-5 space-y-3 border-t border-line pt-5">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <ProductImage
                    slug={item.productId ?? item.id}
                    images={item.productImages ?? undefined}
                    alt={item.productName ?? "Unknown product"}
                    className="h-14 w-14 shrink-0 rounded-xs object-cover"
                  />
                  <span className="font-display text-xl font-medium text-fg">
                    {item.productName ?? "Unknown product"}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex justify-between border-t border-line pt-4 text-sm text-muted">
              <span>{itemCountLabel}</span>
              <span className="font-semibold text-fg">{formatPrice(order.total)}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
};

const PersonalInfoTab = ({ userId, email }: { userId: string; email: string | undefined }) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
  });

  if (isLoading) {
    return <div className="skeleton h-40 w-full max-w-md" aria-hidden />;
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
    <form onSubmit={handleSubmit} className="card max-w-md space-y-6 p-6 sm:p-8">
      <div>
        <p className="label">Email</p>
        <p className="mt-2 text-fg">{email}</p>
      </div>

      <div>
        <label htmlFor="full-name" className="label">
          Full name
        </label>
        <input
          id="full-name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="input mt-2"
        />
      </div>

      {savedMessage && <p className="alert-info">{savedMessage}</p>}
      {saveMutation.isError && (
        <p className="alert-error">Could not save your changes. Please try again.</p>
      )}

      <button type="submit" disabled={saveMutation.isPending} className="btn btn-primary">
        {saveMutation.isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
};

const Account = () => {
  useSeo({
    title: "Your account | JME Forge Shop",
    description: "Your orders and personal information.",
    noindex: true,
  });

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
    <section className="container-page max-w-4xl py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="section-title mt-3">Your account</h1>
          <p className="mt-3 text-sm text-muted">{user.email}</p>
        </div>
        <button type="button" onClick={handleSignOut} className="btn btn-outline">
          Sign out
        </button>
      </div>

      {checkoutSucceeded && (
        <p className="alert-info mt-8 flex items-center gap-3">
          <CheckIcon className="h-5 w-5 shrink-0" />
          Thanks for your order! It&rsquo;ll show up below shortly.
        </p>
      )}

      <div role="tablist" className="mt-10 flex gap-8 border-b border-line">
        {tabs.map((tabOption) => (
          <button
            key={tabOption.value}
            type="button"
            role="tab"
            aria-selected={tab === tabOption.value}
            onClick={() => setTab(tabOption.value)}
            className={`-mb-px border-b-2 pb-3 text-[0.7rem] font-semibold tracking-[0.2em] uppercase transition-colors ${
              tab === tabOption.value
                ? "border-ember text-fg"
                : "border-transparent text-subtle hover:text-fg"
            }`}
          >
            {tabOption.label}
          </button>
        ))}
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
