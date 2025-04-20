/* ──────────────────────────────────────────────────────────
   src/components/RecipeWizard.jsx
   ────────────────────────────────────────────────────────── */
   import { useState, useEffect } from "react";
   import AsyncCreatableSelect from "react-select/async-creatable";
   import api from "../api/api";
   import * as Dialog from "@radix-ui/react-dialog";
   import { toast } from "react-toastify";
   import confetti from "canvas-confetti";
   
   /* helper: dto → react‑select option */
   const toOpt = (x) => ({ value: x.id, label: x.name });
   
   export default function RecipeWizard({ recipe = null, onSaved, className = "" }) {
     const isEdit = Boolean(recipe);
     const [open, setOpen] = useState(false);
     const [step, setStep] = useState(1);
   
     /* ─── form fields ─── */
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
   
     const [ingredients, setIngredients] = useState([
       { ingredientId: "", name: "", quantity: "", unit: "" },
     ]);
     const [categories, setCategories] = useState([]);
   
     /* auto‑open when editing */
     useEffect(() => {
       if (isEdit) setOpen(true);
     }, [isEdit]);
   
     /* reset blank form */
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
       setIngredients([{ ingredientId: "", name: "", quantity: "", unit: "" }]);
     };
   
     /* load categories + full recipe if editing */
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
         setIngredients(
           rec.ingredients && rec.ingredients.length
             ? rec.ingredients.map((i) => ({
                 ingredientId: i.ingredientId,
                 name: i.name,
                 quantity: i.quantity,
                 unit: i.unit,
               }))
             : [{ ingredientId: "", name: "", quantity: "", unit: "" }]
         );
       };
   
       if (isEdit) {
         if (recipe.ingredients) {
           fill(recipe);
         } else {
           api
             .get(`/MyRecipes/${recipe.recipeId}`)
             .then((r) => fill(r.data))
             .catch((e) => {
               console.error("Load recipe failed", e);
               toast.error("Could not load recipe");
               setOpen(false);
             });
         }
       } else {
         resetBlank();
       }
     }, [open, isEdit, recipe]);
   
     // update image preview
     useEffect(() => {
       setPreview(imageUrl || null);
     }, [imageUrl]);
   
     /* ingredient‑rows helpers */
     const addRow = () =>
       setIngredients((prev) => [
         ...prev,
         { ingredientId: "", name: "", quantity: "", unit: "" },
       ]);
     const delRow = (idx) =>
       setIngredients((prev) => prev.filter((_, i) => i !== idx));
     const setRow = (idx, row) =>
       setIngredients((prev) => prev.map((r, i) => (i === idx ? row : r)));
   
     /* async‑select helpers */
     const loadOpts = (q) =>
       api
         .get(`/ingredients/search?query=${encodeURIComponent(q)}`)
         .then((r) => r.data.map(toOpt));
     const createIng = async (name) => toOpt((await api.post("/ingredients", { name })).data);
   
     /* build payload */
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
       ingredients: ingredients.map((i) => ({
         ingredientId: i.ingredientId ? Number(i.ingredientId) : 0,
         name: i.name,
         quantity: parseFloat(i.quantity),
         unit: i.unit,
       })),
       // ← include recipeId when editing
       ...(isEdit ? { recipeId: recipe.recipeId } : {}),
     };
   
     /* save */
     const save = async () => {
       try {
         await api[isEdit ? "put" : "post"](
           isEdit ? "/myrecipes/update" : "/myrecipes/add",
           payload
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
   
     /* delete */
     const remove = async () => {
       if (!window.confirm("Delete this recipe?")) return;
       await api.delete(`/myrecipes/${recipe.recipeId}`);
       toast.info("Deleted");
       setOpen(false);
       onSaved?.();
     };
   
     /* navigation */
     const next = () => step < 4 && setStep((s) => s + 1);
     const back = () => step > 1 && setStep((s) => s - 1);
   
     return (
       <Dialog.Root open={open} onOpenChange={setOpen}>
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
             <h2 className="mb-4 text-center text-2xl font-bold">
               {isEdit ? "Update Recipe" : "Add New Recipe"}
             </h2>
   
             {/* form wrapper blocks implicit submit */}
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
               {/* STEP 1 */}
               {step === 1 && (
                 <>
                   <input
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="Title"
                     required
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                   />
                   <input
                     type="text"
                     value={imageUrl}
                     onChange={(e) => setImageUrl(e.target.value)}
                     placeholder="Image URL"
                     required
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                   />
                   {preview && (
                     <img
                       src={preview}
                       alt=""
                       className="mt-2 max-h-64 w-full object-contain"
                     />
                   )}
                   <input
                     type="text"
                     value={sourceUrl}
                     onChange={(e) => setSourceUrl(e.target.value)}
                     placeholder="Source URL"
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                   />
                 </>
               )}
   
               {/* STEP 2 */}
               {step === 2 && (
                 <>
                   <div className="grid grid-cols-2 gap-4">
                     <input
                       type="number"
                       value={servings}
                       onChange={(e) => setServings(e.target.value)}
                       min={1}
                       placeholder="Servings"
                       required
                       className="rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                     />
                     <input
                       type="number"
                       value={cookingTime}
                       onChange={(e) => setCookingTime(e.target.value)}
                       min={1}
                       placeholder="Cooking Time (min)"
                       required
                       className="rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                     />
                   </div>
                   <input
                     type="text"
                     value={cuisine}
                     onChange={(e) => setCuisine(e.target.value)}
                     placeholder="Cuisine"
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                   />
                   <select
                     value={categoryId}
                     onChange={(e) => setCategoryId(e.target.value)}
                     required
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
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
   
               {/* STEP 3 */}
               {step === 3 && (
                 <>
                   <textarea
                     value={summary}
                     onChange={(e) => setSummary(e.target.value)}
                     placeholder="Summary"
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                   />
                   <textarea
                     value={instructionsText}
                     onChange={(e) => setInstructionsText(e.target.value)}
                     placeholder="Instructions"
                     className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
                   />
                   <div className="flex flex-wrap gap-4 text-sm">
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
                 </>
               )}
   
               {/* STEP 4 */}
               {step === 4 && (
                 <>
                   {ingredients.map((row, idx) => (
                     <IngredientRow
                       key={idx}
                       row={row}
                       onChange={(r) => setRow(idx, r)}
                       onRemove={() => delRow(idx)}
                       loadOpts={loadOpts}
                       createIng={createIng}
                     />
                   ))}
                   <button
                     type="button"
                     onClick={addRow}
                     className="mt-2 text-sm text-blue-600 hover:underline"
                   >
                     + Add Ingredient
                   </button>
                 </>
               )}
   
               {/* navigation + save */}
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
                 {step < 4 ? (
                   <button
                     type="button"
                     onClick={next}
                     className="ml-auto rounded bg-blue-600 px-4 py-2 text-white"
                   >
                     Next →
                   </button>
                 ) : (
                   <button
                     type="button"
                     onClick={save}
                     className="ml-auto rounded bg-green-600 px-4 py-2 text-white"
                   >
                     {isEdit ? "Update" : "Save"}
                   </button>
                 )}
               </div>
   
               {isEdit && step === 4 && (
                 <button
                   type="button"
                   onClick={remove}
                   className="mt-4 block w-full rounded bg-red-600 py-2 text-white"
                 >
                   Delete Recipe
                 </button>
               )}
             </form>
           </Dialog.Content>
         </Dialog.Portal>
       </Dialog.Root>
     );
   }
   
   /* ─── ingredient row ─── */
   function IngredientRow({ row, onChange, onRemove, loadOpts, createIng }) {
     const opt =
       row.ingredientId !== ""
         ? { value: row.ingredientId, label: row.name }
         : row.name
         ? { value: 0, label: row.name }
         : null;
   
     const choose = (o) => onChange({ ...row, ingredientId: o.value, name: o.label });
   
     return (
       <div className="mt-2 flex items-center gap-2">
         <div className="w-1/2">
           <AsyncCreatableSelect
             cacheOptions
             defaultOptions
             value={opt}
             loadOptions={loadOpts}
             onChange={choose}
             onCreateOption={async (v) => choose(await createIng(v))}
             placeholder="Ingredient…"
             styles={{
               control: (b) => ({ ...b, minHeight: 38 }),
               menu: (b) => ({ ...b, zIndex: 9999 }),
             }}
           />
         </div>
         <input
           type="number"
           min={0}
           step="0.01"
           placeholder="Qty"
           value={row.quantity}
           required
           onChange={(e) => onChange({ ...row, quantity: e.target.value })}
           className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
         />
         <input
           value={row.unit}
           placeholder="Unit"
           required
           onChange={(e) => onChange({ ...row, unit: e.target.value })}
           className="w-1/4 rounded border px-3 py-2 dark:bg-gray-800 dark:text-white"
         />
         <button
           type="button"
           onClick={onRemove}
           className="text-sm text-red-600 hover:underline"
         >
           Remove
         </button>
       </div>
     );
   }
   