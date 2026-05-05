import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAdmin, useMenu } from "@/lib/store";
import { CATEGORIES, type Category, type Dish } from "@/lib/menu-data";
import { SITE, formatINR } from "@/lib/site-config";
import { dishesService } from "@/lib/database-service";
import { handleImageUpload, convertToPaise } from "@/lib/admin-utils";
import { SectionTitle } from "@/components/site/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Pencil, Plus, Trash2, Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin â€” Eat Street" }] }),
  component: Admin,
});

function Admin() {
  const { isAdmin, login, logout } = useAdmin();
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-md">
        <SectionTitle eyebrow="Admin" title="Sign In" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (login(pw)) toast.success("Welcome back, Sir");
            else toast.error("Wrong password");
          }}
          className="bg-card border border-border/40 rounded-xl p-6 space-y-4 animate-fade-up"
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Admin password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
          >
            Sign In
          </Button>
        </form>
      </div>
    );
  }

  return <AdminPanel onLogout={logout} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { dishes, addDish, updateDish, deleteDish } = useMenu();
  const [editing, setEditing] = useState<Dish | null>(null);
  const [open, setOpen] = useState(false);

  const startNew = () => {
    setEditing({
      id: "",
      name: "",
      description: "",
      price: 0,
      category: CATEGORIES[0],
      image: "",
    });
    setOpen(true);
  };
  const startEdit = (d: Dish) => {
    setEditing(d);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Admin</p>
          <h1 className="text-4xl font-display text-gradient-gold">Manage Menu</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={startNew}
            className="bg-gradient-gold text-primary-foreground hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Dish
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Clear all local menu items? This only clears your browser cache.")) {
                localStorage.removeItem("saffron-menu");
                window.location.reload();
              }
            }}
          >
            Clear Local Menu
          </Button>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((d) => (
          <div
            key={d.id}
            className="bg-card border border-border/40 rounded-lg overflow-hidden flex"
          >
            {d.image && (
              <img src={d.image} alt={d.name} className="w-28 h-28 object-cover flex-shrink-0" />
            )}
            <div className="flex-1 p-3 min-w-0">
              <p className="text-xs text-primary uppercase tracking-widest">{d.category}</p>
              <p className="font-medium truncate">{d.name}</p>
              <p className="text-sm text-muted-foreground">{formatINR(d.price)}</p>
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(d)}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={async () => {
                    try {
                      await dishesService.deleteDish(d.id);
                      deleteDish(d.id);
                      toast.success("Dish deleted from Supabase");
                    } catch (error) {
                      console.error("Error deleting dish:", error);
                      toast.error("Failed to delete dish");
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing?.id ? "Edit Dish" : "New Dish"}
            </DialogTitle>
            <DialogDescription>
              Add or update a menu item and optionally attach an image.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <DishForm
              initial={editing}
              isNew={!editing.id}
              onSubmit={async (d) => {
                try {
                  if (editing.id) {
                    // Update existing dish in Supabase
                    await dishesService.updateDish(editing.id, {
                      name: d.name,
                      description: d.description,
                      price: convertToPaise(d.price),
                      category: d.category,
                      image_url: d.image || null,
                    });
                    updateDish(editing.id, d);
                    toast.success("Dish updated in Supabase");
                  } else {
                    // Create the dish first so storage issues do not block saving the row.
                    const newDish = await dishesService.createDish({
                      name: d.name,
                      description: d.description,
                      price: convertToPaise(d.price),
                      category: d.category,
                      image_url: null,
                      is_available: true,
                    });

                    if (newDish) {
                      let imageUrl = d.image || null;

                      // If image is a data URL (base64), upload to storage as a best-effort step.
                      if (d.image?.startsWith("data:")) {
                        try {
                          const blob = await fetch(d.image).then((res) => res.blob());
                          const file = new File([blob], "dish-image.jpg", { type: "image/jpeg" });
                          imageUrl = await handleImageUpload(file, newDish.id);

                          if (imageUrl) {
                            await dishesService.updateDish(newDish.id, {
                              image_url: imageUrl,
                            });
                          }
                        } catch (imageError) {
                          console.error("Dish saved without uploaded image:", imageError);
                          const msg = imageError instanceof Error ? imageError.message : String(imageError);
                          toast.error(`Dish saved, image upload failed: ${msg}`);
                        }
                      }

                      const id =
                        d.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
                      addDish({ ...d, id });
                      toast.success("Dish added to Supabase");
                    }
                  }
                  setOpen(false);
                } catch (error) {
                  console.error("Error saving dish:", error);
                  toast.error("Failed to save dish to Supabase");
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DishForm({
  initial,
  isNew,
  onSubmit,
}: {
  initial: Dish;
  isNew: boolean;
  onSubmit: (d: Omit<Dish, "id">) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(initial.price);
  const [category, setCategory] = useState<Category>(initial.category);
  const [image, setImage] = useState(initial.image);
  const [hasDualPricing, setHasDualPricing] = useState(initial.hasDualPricing || false);
  const [halfPrice, setHalfPrice] = useState(initial.halfPrice || 0);
  const [fullPrice, setFullPrice] = useState(initial.fullPrice || 0);

  useEffect(() => {
    setName(initial.name);
    setDescription(initial.description);
    setPrice(initial.price);
    setCategory(initial.category);
    setImage(initial.image);
    setHasDualPricing(initial.hasDualPricing || false);
    setHalfPrice(initial.halfPrice || 0);
    setFullPrice(initial.fullPrice || 0);
  }, [initial]);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <form
      className="space-y-3 max-h-[80vh] overflow-y-auto pr-4"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (!trimmedName || price <= 0) {
          toast.error("Name and price required");
          return;
        }
        if (hasDualPricing && (halfPrice <= 0 || fullPrice <= 0)) {
          toast.error("Both prices required");
          return;
        }
        onSubmit({
          name: trimmedName,
          description: trimmedDescription,
          price,
          category,
          image,
          hasDualPricing,
          halfPrice: hasDualPricing ? halfPrice : undefined,
          fullPrice: hasDualPricing ? fullPrice : undefined,
        });
      }}
    >
      <Input placeholder="Dish name" value={name} onChange={(e) => setName(e.target.value)} />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      {!hasDualPricing && (
        <Input
          type="number"
          placeholder="Price (INR)"
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      )}

      <div className="border border-border/40 rounded-lg p-3 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasDualPricing}
            onChange={(e) => setHasDualPricing(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Enable Dual Pricing (Half & Full)</span>
        </label>
        {hasDualPricing && (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Half Plate Price (INR)"
              value={halfPrice || ""}
              onChange={(e) => setHalfPrice(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Full Plate Price (INR)"
              value={fullPrice || ""}
              onChange={(e) => setFullPrice(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="flex-1 px-3 py-2 border border-border/40 rounded-md text-sm bg-background hover:bg-accent/50 transition-colors">
            <span className="text-muted-foreground">Choose Image</span>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        {image && (
          <div className="relative w-fit">
            <img src={image} alt="" className="h-24 w-24 object-cover rounded" />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => setImage("")}
              className="absolute -top-2 -right-2 h-6 w-6 p-0"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
      >
        {isNew ? "Add Dish" : "Save Changes"}
      </Button>
    </form>
  );
}
