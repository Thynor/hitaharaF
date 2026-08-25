const BASE = "/api";

export async function fetchAllergenCatalog() {
  const res = await fetch(`${BASE}/allergens`);
  if (!res.ok) throw new Error("Could not load allergen catalog.");
  return res.json();
}

export async function scanLabel(imageFile, allergyKeys) {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("allergies", allergyKeys.join(","));

  const res = await fetch(`${BASE}/scan`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Scan failed. Please try again.");
  }
  return res.json();
}
