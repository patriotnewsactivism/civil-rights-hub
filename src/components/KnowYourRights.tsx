import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, ChevronRight, ExternalLink, Scale } from "lucide-react";

interface RightReference {
  summary: string;
  details: string[];
}

const rightsData: Record<string, RightReference> = {
  "First Amendment": {
    summary: "Speech, press, religion, assembly, and petition protections",
    details: [
      "The First Amendment restricts government action affecting speech, press, religion, peaceful assembly, and petition.",
      "These protections are substantial but not absolute; forum rules and content-neutral time, place, and manner restrictions can matter.",
      "Public-employee, school, protest, recording, threat, defamation, and access questions can depend heavily on context and controlling appellate law.",
      "Do not assume a First Amendment label alone answers whether a particular location, restriction, or police order is lawful.",
    ],
  },
  "Second Amendment": {
    summary: "Protection of the right to keep and bear arms",
    details: [
      "The Second Amendment protects an individual right to keep and bear arms, subject to constitutional limits on regulation.",
      "Federal, state, and local firearm rules can differ, including rules governing possession, carry, sensitive places, prohibited persons, and licensing.",
      "Duties during police encounters, including disclosure or identification requirements, vary by jurisdiction and circumstance.",
      "Check current statutes and controlling cases before relying on a generalized carry rule.",
    ],
  },
  "Fourth Amendment": {
    summary: "Protection against unreasonable searches and seizures",
    details: [
      "The Fourth Amendment protects against unreasonable government searches and seizures.",
      "Warrants are central to Fourth Amendment doctrine, especially for homes and digital data, but recognized exceptions can permit warrantless action.",
      "You can state that you do not consent to a search; non-consent does not physically prevent a search that officers otherwise have legal authority to conduct.",
      "Traffic stops, frisks, vehicle searches, arrests, exigent circumstances, consent, and searches incident to arrest each have distinct legal standards.",
    ],
  },
  "Fifth Amendment": {
    summary: "Self-incrimination, due process, double jeopardy, and takings protections",
    details: [
      "The Fifth Amendment includes the privilege against compelled self-incrimination in criminal cases.",
      "Miranda rules concern custodial interrogation; when and how a person must invoke or waive rights can be fact-specific.",
      "The amendment also addresses federal due process, double jeopardy, grand juries in covered federal cases, and just compensation for public takings.",
      "A general desire not to speak and a legally effective invocation can raise different questions depending on the setting.",
    ],
  },
  "Sixth Amendment": {
    summary: "Criminal-prosecution rights including counsel, confrontation, and jury protections",
    details: [
      "The Sixth Amendment applies to criminal prosecutions and protects rights including counsel, notice of accusations, confrontation, compulsory process, and a speedy and public trial.",
      "The right to appointed counsel and the consequences of proceeding without counsel depend on the type and stage of the case.",
      "The Sixth Amendment right to counsel is distinct from the Fifth Amendment / Miranda right to counsel during custodial interrogation.",
      "Deadlines, waiver rules, and the point when particular Sixth Amendment protections attach can be case-specific.",
    ],
  },
  "Eighth Amendment": {
    summary: "Excessive bail, excessive fines, and cruel-and-unusual-punishment protections",
    details: [
      "The Eighth Amendment prohibits excessive bail and fines and cruel and unusual punishments.",
      "The Excessive Bail Clause does not mean every defendant is constitutionally entitled to release on bail in every circumstance.",
      "Conditions-of-confinement and medical-care claims use standards that can vary with custody status and the constitutional provision involved.",
      "Whether a particular amount, sanction, or condition is unconstitutional is highly fact-dependent.",
    ],
  },
  "Tenth Amendment": {
    summary: "Reservation of undelegated powers to the states or the people",
    details: [
      "The Tenth Amendment is a structural federalism provision reserving powers not delegated to the United States or prohibited to the states.",
      "It does not mean state law overrides valid federal law; the Constitution's Supremacy Clause remains controlling.",
      "Many policing, licensing, public-records, and local-government rules arise primarily under state law.",
      "A state-specific question should be checked against that state's constitution, statutes, regulations, and controlling cases.",
    ],
  },
  "Fourteenth Amendment": {
    summary: "Citizenship, due process, and equal-protection protections against state action",
    details: [
      "The Fourteenth Amendment restricts state action through its Citizenship, Due Process, and Equal Protection Clauses.",
      "Through incorporation doctrine, many protections in the Bill of Rights apply to state and local governments.",
      "Equal-protection analysis varies depending on the classification, government action, and level of judicial scrutiny involved.",
      "Many civil-rights claims against state and local officials are litigated under 42 U.S.C. § 1983, but liability requires more than merely alleging unfair treatment.",
    ],
  },
};

const CONSTITUTION_ANNOTATED = "https://constitution.congress.gov/";

export const KnowYourRights = () => {
  return (
    <section id="rights" className="py-20 relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[140px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase">
              <Scale className="h-4 w-4" />
              Federal Constitutional Reference
            </div>
            <h2 className="bg-black text-white font-extrabold p-6 border-l-8 border-blue-900 rounded-sm uppercase tracking-tighter text-3xl md:text-4xl">
              Know Your <span className="text-blue-400">Rights</span>.
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
              Plain-language orientation to major constitutional protections. These summaries are starting points for research, not legal advice and not a substitute for current statutes, controlling cases, or jurisdiction-specific counsel.
            </p>
            <Button asChild variant="outline" className="border-blue-500/30 bg-blue-500/5 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200">
              <a href={CONSTITUTION_ANNOTATED} target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4 mr-2" />
                Research in Constitution Annotated
                <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(rightsData).map(([amendment, content]) => (
              <Sheet key={amendment}>
                <SheetTrigger asChild>
                  <Card className="cursor-pointer group border border-white/8 bg-slate-900 hover:bg-slate-800 hover:border-blue-500/40 transition-all duration-200 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-blue-400 border-blue-500/40 bg-blue-500/10 mb-2 text-xs font-semibold">
                          {amendment}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors mt-0.5" />
                      </div>
                      <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors leading-snug">{amendment}</CardTitle>
                      <CardDescription className="text-slate-400 text-sm leading-relaxed">{content.summary}</CardDescription>
                    </CardHeader>
                  </Card>
                </SheetTrigger>

                <SheetContent side="right" className="bg-slate-950 border-white/10 text-white w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader className="text-left space-y-3 pb-2">
                    <Badge className="w-fit bg-blue-600 text-white border-0">Federal Reference</Badge>
                    <SheetTitle className="text-2xl font-bold text-white leading-tight">{amendment}</SheetTitle>
                    <SheetDescription className="text-slate-400 text-base">{content.summary}</SheetDescription>
                  </SheetHeader>

                  <div className="mt-8 space-y-5">
                    <div className="space-y-3">
                      {content.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/8 items-start">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</div>
                          <p className="text-slate-300 leading-relaxed text-sm">{detail}</p>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                      <a href={CONSTITUTION_ANNOTATED} target="_blank" rel="noopener noreferrer">
                        Verify Against Primary Federal Reference
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>

          <Card className="border-amber-500/25 bg-amber-500/5">
            <CardContent className="p-5 text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-300">State-law review:</strong> the prior 50-state stop-and-identify and recording-consent badges are temporarily removed while each state entry is being tied to current statutes or controlling appellate authority. Use the state selector for navigation, not as a legal conclusion, until that review is complete.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
