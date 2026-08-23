import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CASHAPP_HANDLE,
  CASHAPP_URL,
  PRIMARY_DONATION_LABEL,
  PRIMARY_DONATION_URL,
  VENMO_HANDLE,
  VENMO_URL,
} from "@/config/paymentLinks";
import { DollarSign, ExternalLink, Shield, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";

const Donate = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contribute Financially | Civil Rights Hub"
        description="Voluntary contribution options for Civil Rights Hub. The project does not publish unverified donor totals, fixed allocation claims, invented tiers, or unsupported operating-cost figures."
        ogTitle="Support Civil Rights Hub"
        ogDescription="Voluntary support for hosting, source verification, maintenance, and continued development."
        canonicalUrl="https://civilrightshub.org/donate"
      />
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 py-16 text-center max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold">
              <DollarSign className="h-4 w-4 text-accent" /> Voluntary support
            </div>
            <h1 className="text-4xl md:text-5xl font-black">Support Civil Rights Hub</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Core public tools are currently available without a paid subscription. Voluntary contributions
              can help support hosting, source verification, maintenance, and continued development.
              This page does not claim that any individual contribution is earmarked to a specific expense.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 max-w-3xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> Primary contribution option
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The external payment provider controls the available amount, payment terms, receipts, and account identity shown at checkout.
                </p>
                <Button className="w-full gap-2" asChild>
                  <a href={PRIMARY_DONATION_URL} target="_blank" rel="noopener noreferrer">
                    Continue via {PRIMARY_DONATION_LABEL}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ReceiptText className="h-5 w-5 text-primary" /> Other listed methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer">
                    CashApp — {CASHAPP_HANDLE} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <a href={VENMO_URL} target="_blank" rel="noopener noreferrer">
                    Venmo — {VENMO_HANDLE} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Verify the recipient displayed by the payment provider before completing a transfer.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-14 max-w-3xl">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Financial disclosure standard</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Civil Rights Hub does not currently have connected accounting evidence available on the site for exact monthly operating costs,
                  donor totals, revenue mix, or per-dollar allocation. Previous fixed cost tables and invented membership tiers have been removed rather than presented as fact.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No tax-status or tax-deductibility representation is made here. Rely on the receipt provided by the payment service and qualified tax advice for your circumstances.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/transparency">Review transparency status</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
