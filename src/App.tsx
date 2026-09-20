import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import RequireSuperUser from "./components/RequireSuperUser";
import { supabase } from "./lib/supabaseClient";
import Account from "./pages/Account";
import AddProduct from "./pages/AddProduct";
import AllOrders from "./pages/admin/AllOrders";
import EditProduct from "./pages/admin/EditProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import { useAuthStore } from "./stores/useAuthStore";

const App = () => {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/login" element={<Auth />} />
        <Route element={<RequireAuth />}>
          <Route path="/account" element={<Account />} />
        </Route>
        <Route element={<RequireSuperUser />}>
          <Route path="/addproduct" element={<AddProduct />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/orders" element={<AllOrders />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/products/:id/edit" element={<EditProduct />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
