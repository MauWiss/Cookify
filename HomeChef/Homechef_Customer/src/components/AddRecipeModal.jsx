import { useState, useEffect } from "react";
import api from "../api/api";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

export default function RecipeWizard({
  recipe = null,
  onSaved,
  className = "",
}) {
  const isEdit = Boolean(recipe);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [servings, setServings] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [summary, setSummary] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEdit) setOpen(true);
  }, [isEdit]);

  const resetBlank = () => {
    setStep(1);
    setTitle("");
    setImageUrl("");
    setSourceUrl("");
    setPreview(null);
    setServings("");
    setCookingTime("");
    setCategoryId("");
    setCuisine("");
    setSummary("");
    setInstructionsText("");
    setVegetarian(false);
    setVegan(false);
    setGlutenFree(false);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  useEffect(() => {
    if (!open) return;

    api.get("/categories").then((r) => setCategories(r.data));

    const fill = (rec) => {
      setStep(1);
      setTitle(rec.title);
      setImageUrl(rec.imageUrl);
      setSourceUrl(rec.sourceUrl || "");
      setPreview(rec.imageUrl);
      setServings(String(rec.servings));
      setCookingTime(String(rec.cookingTime));
      setCategoryId(String(rec.categoryId));
      setCuisine(rec.cuisine || "");
      setSummary(rec.summary || "");
      setInstructionsText(rec.instructionsText || "");
      setVegetarian(rec.vegetarian);
      setVegan(rec.vegan);
      setGlutenFree(rec.glutenFree);
    };

    if (isEdit) {
      api
        .get(`/MyRecipes/${recipe.recipeId}`)
        .then((r) => fill(r.data))
        .catch((e) => {
          console.error("Load recipe failed", e);
          toast.error("Could not load recipe");
          setOpen(false);
        });
    } else {
      resetBlank();
    }
  }, [open, isEdit, recipe]);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const payload = {
    title,
    imageUrl,
    sourceUrl,
    servings: Number(servings),
    cookingTime: Number(cookingTime),
    categoryId: Number(categoryId),
    cuisine,
    summary,
    instructionsText,
    vegetarian,
    vegan,
    glutenFree,
    ...(isEdit ? { recipeId: recipe.recipeId } : {}),
  };

  const save = async () => {
    try {
      await api[isEdit ? "put" : "post"](
        isEdit ? "/myrecipes/update" : "/myrecipes/add",
        payload,
      );
      toast.success(isEdit ? "Updated ✔" : "Added ✔");
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setOpen(false);
      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this recipe?")) return;
    await api.delete(`/myrecipes/${recipe.recipeId}`);
    toast.info("Deleted");
    setOpen(false);
    onSaved?.();
  };

  const next = () => step < 3 && setStep((s) => s + 1);
  const back = () => step > 1 && setStep((s) => s - 1);

  const isStep1Valid = title.trim() && imageUrl.trim();
  const isStep2Valid = servings > 0 && cookingTime > 0 && categoryId;
  const isStep3Valid = summary.trim() && instructionsText.trim();

  const isFormValid = isStep1Valid && isStep2Valid && isStep3Valid;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        if (!val && !isEdit) {
          const confirmExit = window.confirm(
            "Exit without saving? Your progress will be lost.",
          );
          if (confirmExit) setOpen(false); // allow closing
        } else {
          setOpen(val); // allow closing if user is editing
        }
      }}
    >
      {!isEdit && (
        <Dialog.Trigger
          type="button"
          className={className || "rounded bg-blue-600 px-4 py-2 text-white"}
        >
          + Add Recipe
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[90vh] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-[#1f1f1f]">
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 text-xl text-gray-400"
            >
              ×
            </button>
          </Dialog.Close>
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">
            {isEdit ? "Update Recipe" : "Add New Recipe"}
          </h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                {/* TITLE */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    handleChange("title", e.target.value);
                  }}
                  onBlur={() => handleBlur("title")}
                  placeholder="Title"
                  required
                  className={`w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                    touched.title && !title.trim() ? "border-red-500" : ""
                  }`}
                />

                {/* IMAGE URL */}
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    handleChange("imageUrl", e.target.value);
                  }}
                  onBlur={() => handleBlur("imageUrl")}
                  placeholder="Image URL"
                  required
                  className={`w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                    touched.imageUrl && !imageUrl.trim() ? "border-red-500" : ""
                  }`}
                />

                {/* PREVIEW */}
                {preview && (
                  <img
                    src={preview}
                    alt=""
                    className="mt-2 max-h-64 w-full object-contain"
                  />
                )}

                {/* SOURCE URL */}
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    handleChange("sourceUrl", e.target.value);
                  }}
                  onBlur={() => handleBlur("sourceUrl")}
                  placeholder="Source URL"
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                />
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {/* SERVINGS */}
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => {
                      setServings(e.target.value);
                      handleChange("servings", e.target.value);
                    }}
                    onBlur={() => handleBlur("servings")}
                    min={1}
                    placeholder="Servings"
                    required
                    className={`rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                      touched.servings && !servings ? "border-red-500" : ""
                    }`}
                  />

                  {/* COOKING TIME */}
                  <input
                    type="number"
                    value={cookingTime}
                    onChange={(e) => {
                      setCookingTime(e.target.value);
                      handleChange("cookingTime", e.target.value);
                    }}
                    onBlur={() => handleBlur("cookingTime")}
                    min={1}
                    placeholder="Cooking Time (min)"
                    required
                    className={`rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                      touched.cookingTime && !cookingTime
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>

                {/* CUISINE */}
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="Cuisine"
                  className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                />

                {/* CATEGORY */}
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    handleChange("categoryId", e.target.value);
                  }}
                  onBlur={() => handleBlur("categoryId")}
                  required
                  className={`w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                    touched.categoryId && !categoryId ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {step === 3 && (
              <>
                {/* SUMMARY */}
                <textarea
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    handleChange("summary", e.target.value);
                  }}
                  onBlur={() => handleBlur("summary")}
                  placeholder="Summary"
                  className={`w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                    touched.summary && !summary.trim() ? "border-red-500" : ""
                  }`}
                />

                {/* INSTRUCTIONS */}
                <textarea
                  value={instructionsText}
                  onChange={(e) => {
                    setInstructionsText(e.target.value);
                    handleChange("instructionsText", e.target.value);
                  }}
                  onBlur={() => handleBlur("instructionsText")}
                  placeholder="Instructions"
                  className={`w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${
                    touched.instructionsText && !instructionsText.trim()
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {/* CHECKBOXES */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-800 dark:text-white">
                  <label>
                    <input
                      type="checkbox"
                      checked={vegetarian}
                      onChange={() => setVegetarian((v) => !v)}
                    />{" "}
                    Vegetarian
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={vegan}
                      onChange={() => setVegan((v) => !v)}
                    />{" "}
                    Vegan
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={glutenFree}
                      onChange={() => setGlutenFree((v) => !v)}
                    />{" "}
                    Gluten‑Free
                  </label>
                </div>

                {/* SAVE BUTTON */}
                <div className="mt-6 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={back}
                      className="rounded bg-gray-200 px-3 py-1"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={save}
                    disabled={!isFormValid}
                    className={`ml-auto rounded px-4 py-2 text-white transition ${
                      isFormValid
                        ? "bg-green-600 hover:bg-green-700"
                        : "cursor-not-allowed bg-gray-400"
                    }`}
                  >
                    {isEdit ? "Update" : "Save"}
                  </button>
                </div>
              </>
            )}
            {/* NAVIGATION for Step 1 & 2 */}
            {step < 3 && (
              <div className="mt-6 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={back}
                    className="rounded bg-gray-200 px-3 py-1"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={
                    (step === 1 && !isStep1Valid) ||
                    (step === 2 && !isStep2Valid)
                  }
                  className={`ml-auto rounded px-4 py-2 text-white transition ${
                    (step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
