"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Product, ProductTag, Category } from "@/types";

const allTags: ProductTag[] = ["nuevo", "masVendido", "oferta"];

export default function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? categories[0]?.slug ?? "",
    subcategory: product?.subcategory ?? categories[0]?.subcategories[0] ?? "",
    price: product?.price?.toString() ?? "",
    previousPrice: product?.previousPrice?.toString() ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    images: product?.images?.join("\n") ?? "",
    stock: product?.stock?.toString() ?? "10",
    tags: product?.tags ?? [],
    active: product?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.slug === form.category);

  function toggleTag(tag: ProductTag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      price: Number(form.price),
      previousPrice: form.previousPrice ? Number(form.previousPrice) : undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      tags: form.tags,
      active: form.active,
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) onSaved();
    else setError("No pudimos guardar el producto");
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Nombre del producto"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="number"
            placeholder="Precio"
            className={inputClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio anterior (opcional)"
            className={inputClass}
            value={form.previousPrice}
            onChange={(e) => setForm({ ...form, previousPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            className={inputClass}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => {
              const cat = categories.find((c) => c.slug === e.target.value);
              setForm({
                ...form,
                category: e.target.value as Product["category"],
                subcategory: cat?.subcategories[0] ?? "",
              });
            }}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            className={inputClass}
            value={form.subcategory}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
          >
            {selectedCategory?.subcategories.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Descripción corta"
          className={`${inputClass} mt-3`}
          rows={2}
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
        />
        <textarea
          placeholder="Descripción completa"
          className={`${inputClass} mt-3`}
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <textarea
          placeholder="URLs de imágenes (una por línea)"
          className={`${inputClass} mt-3`}
          rows={3}
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                form.tags.includes(tag) ? "border-accent bg-accent text-[#1a1408]" : "border-border text-muted"
              }`}
            >
              {tag === "nuevo" ? "Nuevo" : tag === "masVendido" ? "Más vendido" : "Oferta"}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Producto activo (visible en la tienda)
        </label>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#1a1408] disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
