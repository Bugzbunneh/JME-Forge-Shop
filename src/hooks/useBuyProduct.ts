import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { createCheckoutSession } from "../api/checkout";
import { useAuthStore } from "../stores/useAuthStore";
import type { Product } from "../types/product";

export const useBuyProduct = (product: Product) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: () => createCheckoutSession(product.id),
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    },
  });

  const buy = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    mutation.mutate();
  };

  return {
    buy,
    isLoggedIn: Boolean(user),
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
};
