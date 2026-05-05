import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import { useMenu } from "@/lib/store";
import { dishesService } from "@/lib/database-service";
import { supabaseDishToLocal } from "@/lib/admin-utils";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eat Street — Modern Indian Cuisine" },
      {
        name: "description",
        content:
          "An elegant modern Indian restaurant serving timeless recipes from across the subcontinent. Order on WhatsApp.",
      },
      { property: "og:title", content: "Eat Street — Modern Indian Cuisine" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const setDishes = useMenu((state) => state.setDishes);

  useEffect(() => {
    let cancelled = false;

    const loadMenu = async () => {
      try {
        const dishes = await dishesService.getAllDishes();
        if (cancelled) return;

        setDishes(dishes.map(supabaseDishToLocal));
      } catch (error) {
        console.error("Error loading menu from Supabase:", error);
      }
    };

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [setDishes]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
