// src/services/productService.js
// Single source of truth for all product-related Supabase queries.
// Components never import supabase directly — they use this service or the hooks.

import { supabase } from "../lib/supabase";

// ─── Fetch list of products with optional filters ─────────────────────────────
// filters: { category, metal, stone, minPrice, maxPrice, search, page, limit }
export async function fetchProducts(filters = {}) {
  const {
    category,
    metal,
    stone,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
  } = filters;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("isActive", true)
    .order("createdAt", { ascending: false });

  if (category) query = query.eq("category", category);
  if (metal) query = query.eq("metal", metal);
  if (stone) query = query.eq("stone", stone);
  if (minPrice) query = query.gte("price", minPrice);
  if (maxPrice) query = query.lte("price", maxPrice);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    products: data,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}

// ─── Fetch a single product by id ─────────────────────────────────────────────
export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("isActive", true)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Fetch distinct categories ────────────────────────────────────────────────
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("isActive", true)
    .not("category", "is", null);

  if (error) throw new Error(error.message);

  // Deduplicate
  return [...new Set(data.map((r) => r.category))];
}

// ─── Fetch featured / newest products ────────────────────────────────────────
export async function fetchFeaturedProducts(limit = 4) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("isActive", true)
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

// ─── Admin: create a product ──────────────────────────────────────────────────
export async function createProduct(productData) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Admin: update a product ──────────────────────────────────────────────────
export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Admin: soft-delete (deactivate) a product ───────────────────────────────
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .update({ isActive: false })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
