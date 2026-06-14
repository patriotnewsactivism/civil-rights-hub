import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingBag, Truck, RefreshCw, Shield } from "lucide-react";

// Update this to your Printify or Printful store URL once configured
const STORE_URL = import.meta.env.VITE_STORE_URL as string | undefined;

const PRODUCTS = [
  {
    emoji: "📋",
    name: "\"Know Your Rights\" Pocket Card",
    description:
      "Laminated wallet card with the essential scripts for police stops, searches, and arrests. Fits in your pocket.",
    price: "$5",
    tag: "Bestseller",
  },
  {
    emoji: "📖",
    name: "Protest Safety Guide",
    description:
      "12-page printed guide covering First Amendment rights, FOIA basics, what to document, and emergency contacts.",
    price: "$10",
    tag: null,
  },
  {
    emoji: "🏷️",
    name: "Civil Rights Hub Sticker Pack",
    description: "4-sticker pack: shield logo, \"I Know My Rights\", \"Record Everything\", and \"Free Press\".",
    price: "$3",
    tag: null,
  },
  {
    emoji: "👕",
    name: "\"I Know My Rights\" T-Shirt",
    description:
      "Unisex shirt, screen-printed in the US. Available in S–3XL. Ships in 5–7 business days.",
    price: "$25",
    tag: "Print on demand",
  },
];

const GUARANTEES = [
  { icon: Truck, text: "Ships in 5–7 business days (print on demand — no inventory stored)" },
  { icon: RefreshCw, text: "100% satisfaction guarantee — contact us if anything is wrong" },
  { icon: Shield, text: "Proceeds support the free platform — no investor profit" },
];

const Store = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Store | Civil Rights Hub"
      description="Support Civil Rights Hub with merchandise — pocket rights cards, protest safety guides, stickers, and shirts. Proceeds keep the platform free."
      ogTitle="Civil Rights Hub Store"
      ogDescription="Pocket rights cards, protest guides, stickers, and shirts. Proceeds go directly to keeping Civil Rights Hub free."
    />
    <Header />
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-14 max-w-3xl text-center space-y-4">
          <ShoppingBag className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-4xl font-black">Support the mission, wear the movement</h1>
          <p className="text-lg text-muted-foreground">
            Every purchase helps keep Civil Rights Hub free for everyone. Products ship via
            print-on-demand — no inventory, no waste.
          </p>
          {STORE_URL && (
            <Button size="lg" className="gap-2" asChild>
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer">
                Shop now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold mb-8">Products</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {PRODUCTS.map(({ emoji, name, description, price, tag }) => (
            <div
              key={name}
              className="rounded-xl border bg-card p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm leading-snug">{name}</h3>
                      {tag && (
                        <Badge variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-lg font-black text-primary flex-shrink-0">{price}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              {STORE_URL ? (
                <Button variant="outline" size="sm" className="w-full gap-1.5 mt-auto" asChild>
                  <a href={STORE_URL} target="_blank" rel="noopener noreferrer">
                    Buy for {price}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              ) : (
                <div className="mt-auto rounded-lg bg-muted/50 border border-dashed p-3 text-center text-xs text-muted-foreground">
                  Store coming soon — check back shortly
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Guarantees */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h2 className="text-lg font-semibold mb-6">What to expect</h2>
          <ul className="space-y-4">
            {GUARANTEES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Questions? Email{" "}
            <a href="mailto:info@civilrightshub.org" className="text-primary underline">
              info@civilrightshub.org
            </a>
          </p>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default Store;
