"use client";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { useLocalStorageState } from "ahooks";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
const layout = ({ children }: { children: any }) => {
  const path = usePathname();
  const router = useRouter();
  const [authToken, setAuthToken] = useLocalStorageState<String | null>(
    "authToken",
    { defaultValue: null }
  );
  useEffect(() => {
    if (!authToken) {
      router.replace("/");
    }
  }, [authToken]);
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center  px-4 lg:h-[60px] lg:px-6"></div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  path == "/dashboard" && "bg-muted text-primary rounded-lg"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                Marché
              </Link>
              <Link
                href="/dashboard/products"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  path == "/dashboard/products" &&
                    "bg-muted text-primary rounded-lg"
                )}
              >
                <Package className="h-4 w-4" />
                Produits{" "}
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button size="sm" className="w-full rounded-xl">
              Deconnexion
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default layout;
