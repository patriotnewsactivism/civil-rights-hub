import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ShoppingBag, AlertTriangle } from "lucide-react";

const STORE_URL = import.meta.env.VITE_STORE_URL as string | undefined;

const Store = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Store | Civil Rights Hub"
      description="Civil Rights Hub storefront status. Product names, prices, shipping promises, and guarantees are shown only through a connected external storefront rather than fabricated in the application."
      ogTitle="Civil Rights Hub Store"
      ogDescription="Open the connected storefront when available."
      canonicalUrl="https://civilrightshub.org/store"
    />
    <Header />
    <main className="flex-1">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center space-y-4">
          <ShoppingBag className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-4xl font-black">Civil Rights Hub Store</h1>
          <p className="text-lg text-muted-foreground">
            Store details should come from the actual commerce provider, not from hardcoded placeholder products or prices in this application.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        {STORE_URL ? (
          <Card className="border-primary/30">
            <CardContent className="p-8 text-center space-y-5">
              <ShoppingBag className="h-10 w-10 text-primary mx-auto" />
              <div>
                <h2 className="text-2xl font-bold">External storefront connected</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Current products, prices, shipping terms, return policies, and availability are controlled by the external storefront. Review those details there before purchasing.
                </p>
              </div>
              <Button size="lg" asChild>
                <a href={STORE_URL} target="_blank" rel="noopener noreferrer">
                  Open storefront <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-8 text-center space-y-4">
              <AlertTriangle className="h-9 w-9 text-amber-500 mx-auto" />
              <div>
                <h2 className="text-xl font-bold">No verified storefront is connected</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  This site will not display invented products, prices, shipping times, bestseller labels, guarantees, or proceeds claims while no real storefront URL is configured.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default Store;
