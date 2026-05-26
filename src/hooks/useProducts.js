import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase.from("Product").select("*").eq("isActive", true);

        if (filters.category) query = query.eq("category", filters.category);
        if (filters.metal) query = query.eq("metal", filters.metal);
        if (filters.search) query = query.ilike("name", `%${filters.search}%`);

        if (filters.sort === "price_low") {
          query = query.order("price", { ascending: true });
        } else if (filters.sort === "price_high") {
          query = query.order("price", { ascending: false });
        } else {
          query = query.order("createdAt", { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.metal, filters.sort, filters.search]);

  return { products, loading, error };
};
