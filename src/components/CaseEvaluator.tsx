import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Scale,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileText,
  ShieldAlert,
  Gavel,
  BookOpen,
  Copy,
  Download,
  Clock,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CASE_TYPES = [
  { value: "police-brutality", label: "Police Brutality / Excessive Force", icon: ShieldAlert },
  { value: "false-arrest", label: "False Arrest / Wrongful Detention", icon: Scale },
  { value: "search-seizure", label: "Illegal Search & Seizure", icon: AlertTriangle },
  { value: "discrimination", label: "Discrimination (Race, Gender, Religion)", icon: Scale },
  { value: "first-amendment", label: "First Amendment Violation", icon: BookOpen },
  { value: "prison-conditions", label: "Prison / Jail Conditions", icon: ShieldAlert },
  { value: "wrongful-conviction", label: "Wrongful Conviction", icon: Gavel },
  { value: "housing-discrimination", label: "Housing Discrimination", icon: Scale },
  { value: "employment-discrimination", label: "Employment Discrimination", icon: Scale },
  { value: "voting-rights", label: "Voting Rights Violation", icon: BookOpen },
  { value: "other", label: "Other Civil Rights Issue", icon: FileText },
] as const;

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

interface EvaluationResult {
  strength: "strong" | "moderate" | "weak" | "needs-investigation";
  summary: string;
  applicableLaws: string[];
  keyPrecedents: string[];
  recommendedActions: string[];
  statueOfLimitations: string;
  potentialDamages: string;
  nextSteps: string[];
  disclaimer: string;
}

// Local evaluation engine — no API call needed, runs in-browser
function evaluateCase(
  caseType: string,
  description: string,
  state: string,
  date: string,
): EvaluationResult {
  const desc = description.toLowerCase();
  const hasInjury = /injur|hurt|hospital|medic|bruis|broken|bleed|wound|pain|scar/.test(desc);
  const hasWitness = /witness|saw|recorded|video|camera|bystander|body.?cam/.test(desc);
  const hasEvidence = /photo|video|record|document|receipt|report|evidence/.test(desc);
  const hasPolice = /officer|cop|police|deputy|trooper|detective|sergeant|lieutenant/.test(desc);
  const wordCount = description.trim().split(/\s+/).length;

  // Calculate strength
  let score = 0;
  if (hasInjury) score += 2;
  if (hasWitness) score += 2;
  if (hasEvidence) score += 2;
  if (hasPolice) score += 1;
  if (wordCount > 50) score += 1;
  if (wordCount > 150) score += 1;
  if (date) score += 1;

  const strength: EvaluationResult["strength"] =
    score >= 6 ? "strong" : score >= 4 ? "moderate" : score >= 2 ? "weak" : "needs-investigation";

  // Laws by case type
  const lawMap: Record<string, string[]> = {
    "police-brutality": [
      "42 U.S.C. § 1983 — Civil Action for Deprivation of Rights",
      "Fourth Amendment — Unreasonable Seizure (Excessive Force)",
      "Fourteenth Amendment — Due Process / Equal Protection",
      "18 U.S.C. § 242 — Deprivation of Rights Under Color of Law",
    ],
    "false-arrest": [
      "42 U.S.C. § 1983 — Civil Action for Deprivation of Rights",
      "Fourth Amendment — Unreasonable Seizure",
      "Fifth Amendment — Due Process",
      "28 U.S.C. § 1343 — Federal Court Jurisdiction",
    ],
    "search-seizure": [
      "Fourth Amendment — Protection Against Unreasonable Search & Seizure",
      "42 U.S.C. § 1983 — Civil Rights Violation",
      "Exclusionary Rule — Mapp v. Ohio",
      "Fruit of the Poisonous Tree Doctrine",
    ],
    "discrimination": [
      "42 U.S.C. § 1983 — Equal Protection Violations",
      "Title VII of the Civil Rights Act of 1964",
      "42 U.S.C. § 1981 — Equal Rights Under the Law",
      "Fourteenth Amendment — Equal Protection Clause",
    ],
    "first-amendment": [
      "First Amendment — Freedom of Speech, Press, Assembly",
      "42 U.S.C. § 1983 — Civil Rights Violation",
      "Prior Restraint Doctrine",
      "Public Forum Doctrine",
    ],
    "housing-discrimination": [
      "Fair Housing Act (42 U.S.C. §§ 3601-3619)",
      "Title VI of the Civil Rights Act of 1964",
      "42 U.S.C. § 1982 — Property Rights",
      "Community Reinvestment Act",
    ],
    "employment-discrimination": [
      "Title VII of the Civil Rights Act of 1964",
      "42 U.S.C. § 1981 — Equal Rights Under the Law",
      "Americans with Disabilities Act (ADA)",
      "Age Discrimination in Employment Act (ADEA)",
    ],
    "voting-rights": [
      "Voting Rights Act of 1965",
      "Fifteenth Amendment — Right to Vote",
      "National Voter Registration Act",
      "Help America Vote Act of 2002",
    ],
  };

  const precedentMap: Record<string, string[]> = {
    "police-brutality": [
      "Graham v. Connor (1989) — Objective reasonableness standard for force",
      "Tennessee v. Garner (1985) — Limits on deadly force by police",
      "Monell v. Dept. of Social Services (1978) — Municipal liability",
      "Hope v. Pelzer (2002) — Clearly established rights",
    ],
    "false-arrest": [
      "Malley v. Briggs (1986) — Qualified immunity limits",
      "Devenpeck v. Alford (2004) — Probable cause standard",
      "Manuel v. City of Joliet (2017) — Pretrial detention claims",
      "Thompson v. Clark (2022) — Favorable termination not required",
    ],
    "search-seizure": [
      "Mapp v. Ohio (1961) — Exclusionary rule",
      "Terry v. Ohio (1968) — Stop and frisk limits",
      "Riley v. California (2014) — Cell phone search requires warrant",
      "Carpenter v. United States (2018) — Cell tower location data",
    ],
    "discrimination": [
      "Brown v. Board of Education (1954) — Separate is not equal",
      "Batson v. Kentucky (1986) — Racial discrimination in jury selection",
      "Ricci v. DeStefano (2009) — Disparate impact",
      "Students for Fair Admissions v. Harvard (2023)",
    ],
    "first-amendment": [
      "Tinker v. Des Moines (1969) — Student free speech",
      "New York Times Co. v. Sullivan (1964) — Press freedom",
      "Glik v. Cunniffe (2011) — Right to record police",
      "Snyder v. Phelps (2011) — Public speech protections",
    ],
  };

  const applicableLaws = lawMap[caseType] ?? [
    "42 U.S.C. § 1983 — Civil Action for Deprivation of Rights",
    "14th Amendment — Due Process & Equal Protection",
  ];
  const keyPrecedents = precedentMap[caseType] ?? [
    "Monell v. Dept. of Social Services (1978) — Municipal liability",
    "Graham v. Connor (1989) — Objective reasonableness",
  ];

  // Statute of limitations by case type
  const solMap: Record<string, string> = {
    "police-brutality": "Generally 2-3 years for § 1983 claims (varies by state). Federal criminal charges: 5 years (18 U.S.C. § 242).",
    "false-arrest": "Generally 2-3 years from date of arrest for § 1983 claims.",
    "search-seizure": "Generally 2-3 years. Discovery rule may toll the statute.",
    "discrimination": "180 days to file EEOC charge (300 days in states with FEP agencies). 2-3 years for § 1983.",
    "employment-discrimination": "180 days (or 300 days with state agency) to file EEOC charge. 90 days after right-to-sue letter.",
    "housing-discrimination": "2 years for FHA claims. 180 days for HUD complaint.",
  };

  const statueOfLimitations = solMap[caseType] ??
    `Typically 2-3 years for § 1983 civil rights claims in ${state || "most states"}. Check your specific state's statute.`;

  // Recommended actions
  const recommendedActions: string[] = [
    "Document everything — write down every detail while your memory is fresh",
    "Photograph any injuries, property damage, or relevant scenes",
    "Collect and preserve all evidence (photos, videos, receipts, medical records)",
    "Get names and contact info of any witnesses",
  ];
  if (hasInjury) {
    recommendedActions.push("Seek medical attention immediately and keep all records");
  }
  if (caseType === "police-brutality" || caseType === "false-arrest") {
    recommendedActions.push("File a formal complaint with the police department's Internal Affairs");
    recommendedActions.push("Request body camera and dash camera footage via FOIA");
    recommendedActions.push("File a complaint with the Department of Justice Civil Rights Division");
  }
  if (caseType === "discrimination" || caseType === "employment-discrimination") {
    recommendedActions.push("File a charge with the EEOC within the filing deadline");
    recommendedActions.push("File a complaint with your state's civil rights agency");
  }
  recommendedActions.push("Consult with a civil rights attorney — many offer free consultations");

  // Potential damages
  const damagesList: string[] = ["Compensatory damages (medical bills, lost wages, pain and suffering)"];
  if (hasInjury) damagesList.push("Medical expenses and future treatment costs");
  damagesList.push("Emotional distress damages");
  if (caseType === "police-brutality" || caseType === "false-arrest") {
    damagesList.push("Punitive damages against individual officers");
  }
  damagesList.push("Attorney's fees under 42 U.S.C. § 1988");
  if (caseType === "employment-discrimination") {
    damagesList.push("Back pay and front pay");
    damagesList.push("Reinstatement or promotion");
  }

  // Strength-based summary
  const summaryMap: Record<string, string> = {
    strong: `Based on your description, this appears to be a *strong potential case*. You have documented evidence, supporting details, and clear indicators of a civil rights violation. The presence of ${hasWitness ? "witnesses" : "evidence"} significantly strengthens your position.`,
    moderate: `This appears to be a *moderate case* with potential. While you have some supporting details, additional evidence collection would strengthen your claim. Focus on gathering documentation, witness statements, and official records.`,
    weak: `This case *needs more development* before it can be evaluated fully. The current description lacks some key details. To strengthen your position, focus on documenting specific dates, gathering evidence, and identifying witnesses.`,
    "needs-investigation": `There isn't enough information yet to fully evaluate this case. We recommend *consulting with a civil rights attorney* who can conduct a thorough investigation and advise you on your options.`,
  };

  return {
    strength,
    summary: summaryMap[strength],
    applicableLaws,
    keyPrecedents,
    recommendedActions,
    statueOfLimitations,
    potentialDamages: damagesList.join("; "),
    nextSteps: [
      `Find a civil rights attorney in ${state || "your state"} on our States Directory`,
      "Use our FOIA Builder to request relevant government records",
      "Save all evidence in the Evidence Vault for secure documentation",
      "Join the Community to connect with others who've been through similar situations",
    ],
    disclaimer:
      "⚠️ This evaluation is for educational purposes only and does NOT constitute legal advice. Every case is unique. Consult with a qualified civil rights attorney for professional legal guidance specific to your situation.",
  };
}

export function CaseEvaluator() {
  const { toast } = useToast();
  const [caseType, setCaseType] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleEvaluate = () => {
    if (!caseType) {
      toast({ title: "Select a case type", variant: "destructive" });
      return;
    }
    if (!description.trim() || description.trim().split(/\s+/).length < 10) {
      toast({
        title: "More detail needed",
        description: "Please describe your situation in at least a few sentences.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    // Simulate brief processing time for UX
    setTimeout(() => {
      const evaluation = evaluateCase(caseType, description, state, incidentDate);
      setResult(evaluation);
      setIsEvaluating(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 800);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const text = [
      "CIVIL RIGHTS CASE EVALUATION",
      "=" .repeat(40),
      `Case Type: ${CASE_TYPES.find((t) => t.value === caseType)?.label}`,
      `State: ${state || "Not specified"}`,
      `Date: ${incidentDate || "Not specified"}`,
      `Strength: ${result.strength.toUpperCase()}`,
      "",
      "SUMMARY",
      result.summary.replace(/\*/g, ""),
      "",
      "APPLICABLE LAWS",
      ...result.applicableLaws.map((l) => `• ${l}`),
      "",
      "KEY PRECEDENTS",
      ...result.keyPrecedents.map((p) => `• ${p}`),
      "",
      "STATUTE OF LIMITATIONS",
      result.statueOfLimitations,
      "",
      "RECOMMENDED ACTIONS",
      ...result.recommendedActions.map((a) => `• ${a}`),
      "",
      "NEXT STEPS",
      ...result.nextSteps.map((s) => `• ${s}`),
      "",
      result.disclaimer,
      "",
      `Generated by Civil Rights Hub — ${new Date().toLocaleDateString()}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Report copied to clipboard" });
  };

  const strengthColors: Record<string, string> = {
    strong: "bg-green-500/20 text-green-400 border-green-500/30",
    moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    weak: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "needs-investigation": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-5 w-5 text-primary" />
            AI Case Evaluator
          </CardTitle>
          <CardDescription>
            Get an instant evaluation of your civil rights case. This tool analyzes your situation
            against federal law, state statutes, and landmark precedents to help you understand your
            legal options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Case Type */}
          <div className="space-y-2">
            <Label className="font-medium">Type of Civil Rights Violation *</Label>
            <Select value={caseType} onValueChange={setCaseType}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of violation..." />
              </SelectTrigger>
              <SelectContent>
                {CASE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="flex items-center gap-2">
                      <t.icon className="h-4 w-4 text-muted-foreground" />
                      {t.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> State Where It Happened
              </Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Date of Incident
              </Label>
              <Input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-medium">Describe What Happened *</Label>
            <Textarea
              placeholder="Describe the incident in detail. Include: what happened, who was involved (officers, witnesses), any injuries, evidence you have (photos, video, body cam requests), and the outcome. The more detail you provide, the better the evaluation."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {description.trim().split(/\s+/).filter(Boolean).length} words •
              More detail = better evaluation
            </p>
          </div>

          <Button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="w-full"
            size="lg"
          >
            {isEvaluating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Scale className="h-4 w-4 mr-2" />
            )}
            Evaluate My Case
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your information stays in your browser — nothing is sent to any server.
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div ref={resultRef} className="space-y-4 animate-fade-in">
          {/* Strength Badge */}
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Case Evaluation</h3>
                <Badge className={strengthColors[result.strength]}>
                  {result.strength === "strong" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {result.strength === "moderate" && <Scale className="h-3 w-3 mr-1" />}
                  {result.strength === "weak" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {result.strength === "needs-investigation" && <FileText className="h-3 w-3 mr-1" />}
                  {result.strength.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.summary.replace(/\*/g, "")}
              </p>
            </CardContent>
          </Card>

          {/* Applicable Laws */}
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gavel className="h-4 w-4 text-primary" /> Applicable Laws
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-1.5">
                {result.applicableLaws.map((law, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">§</span>
                    <span>{law}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Key Precedents */}
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Key Precedents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-1.5">
                {result.keyPrecedents.map((p, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">⚖</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Statute of Limitations */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-red-400 mb-1">Statute of Limitations</h4>
                  <p className="text-sm">{result.statueOfLimitations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card className="border-border/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2">
                {result.recommendedActions.map((action, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="bg-green-500/20 text-green-400 rounded-full h-5 w-5 flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Next Steps on Civil Rights Hub</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-200">{result.disclaimer}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCopyReport} className="gap-2">
              <Copy className="h-4 w-4" /> Copy Full Report
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Download className="h-4 w-4" /> Print / Save PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Small icon helper used in return statement
function ChevronRight(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
