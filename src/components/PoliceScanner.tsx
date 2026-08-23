import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Radio, ExternalLink, ShieldCheck } from "lucide-react";

const PROVIDER_DIRECTORIES = [
  {
    name: "Broadcastify Audio Feeds",
    url: "https://www.broadcastify.com/listen/",
    description: "Search Broadcastify's current public audio-feed directory directly.",
  },
  {
    name: "OpenMHz",
    url: "https://openmhz.com/",
    description: "Browse OpenMHz systems and recordings directly from the provider.",
  },
];

export const PoliceScanner = () => {
  return (
    <section id="police-scanner" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <Radio className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h2 className="text-3xl font-bold text-foreground mb-3">Public-Safety Audio Resources</h2>
            <p className="text-muted-foreground">
              Civil Rights Hub is re-verifying its legacy scanner directory one feed at a time. Individual feed listings and counts are withheld until the provider URL and displayed claims have been checked.
            </p>
          </div>

          <Alert className="border-amber-500/40 bg-amber-500/5">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Scanner directory verification in progress</AlertTitle>
            <AlertDescription>
              The old database and bundled fallback contained unsourced listener counts, frequencies, descriptions, and feed identities. Those records are not being presented as verified merely because a URL was stored in the app.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2">
            {PROVIDER_DIRECTORIES.map((provider) => (
              <Card key={provider.url}>
                <CardHeader>
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <a href={provider.url} target="_blank" rel="noopener noreferrer">
                      Open provider directory
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            External providers control their own listings, availability, delays, encryption status, and terms. Civil Rights Hub is not affiliated with or responsible for those services.
          </p>
        </div>
      </div>
    </section>
  );
};
