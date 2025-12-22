import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AlertTriangle, Clipboard, Ear, Hand, ShieldCheck } from "lucide-react";

interface Playbook {
  id: string;
  title: string;
  summary: string;
  script: string;
  doList: string[];
  dontList: string[];
}

const playbooks: Playbook[] = [
  {
    id: "traffic-stop",
    title: "Traffic stop / ID request",
    summary: "Stay calm, ask if you are being detained, and only provide required documents.",
    script: "Officer, I am recording for my safety. Am I being detained or am I free to go? I do not consent to any searches.",
    doList: [
      "Turn on camera before the officer reaches your window.",
      "Keep hands visible; provide license, registration, and insurance if required in your state.",
      "Ask 'Am I being detained?' to clarify status.",
    ],
    dontList: [
      "Do not consent to a search of your vehicle or phone without a warrant.",
      "Do not step out of the vehicle unless ordered and safe to do so.",
      "Do not argue roadside—note badge numbers for later reporting.",
    ],
  },
  {
    id: "device-search",
    title: "Phone or camera search",
    summary: "You can refuse consent; require a warrant for device access.",
    script: "I do not consent to a search of my device. I am invoking my right to remain silent and want a lawyer.",
    doList: [
      "Lock the device and keep recording the interaction if safe.",
      "State clearly that you do not consent and ask if you are free to leave.",
      "Document the request: time, officers present, and any threats made.",
    ],
    dontList: [
      "Do not share passwords or unlock your device.",
      "Do not delete footage—preserve evidence for your attorney.",
      "Do not sign waivers or consent forms without legal advice.",
    ],
  },
  {
    id: "trespass-warning",
    title: "Trespass warning / dispersal",
    summary: "Confirm who is ordering you to leave and document the directive.",
    script: "Can you identify yourself and confirm if this is a lawful order to leave? I will comply and document this for my records.",
    doList: [
      "Ask the officer or security lead to identify themselves and the legal basis for the order.",
      "Record signage and the surrounding area to show you were in a public forum if applicable.",
      "Exit calmly along the stated route while keeping the camera running.",
    ],
    dontList: [
      "Do not argue or escalate the confrontation at the doorway or exit.",
      "Do not re-enter after a clear warning; log the incident instead.",
      "Do not ignore dispersal orders—challenge them later through counsel.",
    ],
  },
  {
    id: "protest-contact",
    title: "Protest interaction",
    summary: "Stay with a buddy, film from the curb, and use clear rights language.",
    script: "I am a journalist/observer exercising First Amendment rights. I am not interfering and will remain at a safe distance.",
    doList: [
      "Identify legal observers or NLG support lines before the event.",
      "Mark down arrest support numbers on your arm in case your phone is seized.",
      "Film from the curb or sidewalk and announce you are moving if directed.",
    ],
    dontList: [
      "Do not cross police lines or ignore safety instructions.",
      "Do not carry contraband or anything that could be mischaracterized as a weapon.",
      "Do not livestream sensitive organizer details that could expose participants.",
    ],
  },
];

export const ScenarioPlaybooks = () => {
  const [activePlaybook, setActivePlaybook] = useState<Playbook>(playbooks[0]);

  const handleCopy = async (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard not available in this browser");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Script copied for quick use");
    } catch (error) {
      console.error("Failed to copy script", error);
      toast.error("Unable to copy script");
    }
  };

  return (
    <section className="py-16" aria-labelledby="do-this-now">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Hand className="h-6 w-6 text-primary" />
              <h2 id="do-this-now" className="text-3xl font-bold">
                Do This Now
              </h2>
            </div>
            <p className="text-muted-foreground">
              Quick playbooks for common scenarios. Share or play the script aloud, follow the do/don't lists, and
              export for your go-bag.
            </p>
          </div>
          <Badge variant="outline" className="border-amber-500/50 text-amber-700 bg-amber-50">
            Not legal advice; verify with local counsel.
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Scenario library</CardTitle>
              <CardDescription>Pick a situation to load scripts and safety steps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {playbooks.map((playbook) => (
                <button
                  key={playbook.id}
                  type="button"
                  onClick={() => setActivePlaybook(playbook)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activePlaybook.id === playbook.id ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{playbook.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{playbook.summary}</p>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Ear className="h-5 w-5 text-primary" />
                  {activePlaybook.title}
                </CardTitle>
                <CardDescription>{activePlaybook.summary}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleCopy(activePlaybook.script)}>
                <Clipboard className="mr-2 h-4 w-4" />
                Copy script
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed">
                <p className="font-medium text-foreground">Say this:</p>
                <p className="mt-1 text-muted-foreground">“{activePlaybook.script}”</p>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Do</Badge>
                    <span className="text-sm font-semibold">Immediate moves</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {activePlaybook.doList.map((item) => (
                      <li key={item} className="flex gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Don't</Badge>
                    <span className="text-sm font-semibold">Risks to avoid</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {activePlaybook.dontList.map((item) => (
                      <li key={item} className="flex gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                These scripts are informational and do not replace individualized legal advice. Confirm state-specific limits
                (recording, stop-and-identify, and curfew rules) before relying on them.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
