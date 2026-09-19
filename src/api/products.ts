import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/product";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  sold_out: boolean;
  images: string[];
}

const fromRow = (row: ProductRow): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  price: row.price,
  description: row.description,
  soldOut: row.sold_out,
  images: row.images,
});

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ProductRow[]).map(fromRow);
};

export const fetchProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProductRow) : undefined;
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProductRow) : undefined;
};

export interface NewProduct {
  slug: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  imageFiles: File[];
}

export const uploadProductImages = async (slug: string, files: File[]): Promise<string[]> => {
  const urls: string[] = [];

  for (const [index, file] of files.entries()) {
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${slug}/${Date.now()}-${index}.${extension}`;

    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
};

export const createProduct = async (newProduct: NewProduct): Promise<Product> => {
  const images = await uploadProductImages(newProduct.slug, newProduct.imageFiles);

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: newProduct.slug,
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      sold_out: newProduct.soldOut,
      images,
    })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as ProductRow);
};

export interface ProductUpdate {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  newImageFiles: File[];
}

export const updateProduct = async (update: ProductUpdate): Promise<Product> => {
  const payload: Record<string, unknown> = {
    name: update.name,
    price: update.price,
    description: update.description,
    sold_out: update.soldOut,
  };

  if (update.newImageFiles.length > 0) {
    payload.images = await uploadProductImages(update.slug, update.newImageFiles);
  }

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", update.id)
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as ProductRow);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};
