import { Badge } from "@/components/ui/badge";
import { ATTORNEY_DIRECTORY } from "@/lib/seoData";

const KEY_PHRASES = [
  "civil rights attorney directory",
  "police accountability lawyers",
  "First Amendment legal defense",
  "pro bono civil liberties attorneys",
  "constitutional rights legal help",
  "journalist legal support network",
  "protest defense attorneys",
  "civil rights law firms by state",
  "attorneys for FOIA litigation",
  "We The People News legal resources"
];

const WTP_ARTICLES = [
  {
    title: "US Marshals, DOJ Exposed: FOIA Reveals #OperationSilenceThePress",
    url: "https://www.wtpnews.org/us-marshals-foia-operation-silence-the-press/",
    description:
      "Investigative reporting on federal retaliation that underscores the need for rapid-response legal defense teams."
  },
  {
    title: "EXCLUSIVE ONE-ON-ONE INTERVIEW: Civil Rights Attorney Courtney Vincent regarding the Trooper Assault",
    url: "https://www.wtpnews.org/exclusive-one-on-one-interview-civil-rights-attorney-courtney-vincent-regarding-the-trooper-assault/",
    description:
      "First-hand insight from a leading civil rights attorney amplified by We The People News."
  },
  {
    title: "Federal Lawsuit Exposes Galveston-Mississippi Conspiracy to Falsely Imprison Journalist for Nearly a Year",
    url: "https://www.wtpnews.org/galveston-lafayette-lawsuit/",
    description:
      "Detailed coverage of interstate legal action that highlights cross-state defense coalitions."
  },
  {
    title: "New Digital Weapon for Civil Liberties: The Constitutional Rights Legal Research Tool Now Live",
    url: "https://www.wtpnews.org/constitutional-rights-tool/",
    description:
      "Launch coverage connecting Civil Rights Hub technology with We The People News investigative journalism."
  }
];

const nationalNetworks = ATTORNEY_DIRECTORY.filter((entry) => entry.state === "National");
const stateGroups = ATTORNEY_DIRECTORY.filter((entry) => entry.state !== "National").reduce(
  (acc, entry) => {
    if (!acc[entry.state]) {
      acc[entry.state] = [];
    }
    acc[entry.state].push(entry);
    return acc;
  },
  {} as Record<string, (typeof ATTORNEY_DIRECTORY)[number][]>
);

const sortedStates = Object.keys(stateGroups).sort((a, b) => a.localeCompare(b));

export const AttorneySeoContent = () => {
  return (
    <section id="attorney-seo" className="py-20 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 space-y-12">
        <div className="max-w-4xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comprehensive Civil Rights Attorney & Legal Organization Index
          </h2>
          <p className="text-muted-foreground">
            Civil Rights Hub by{' '}
            <a
              href="https://www.wtpnews.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              We The People News
            </a>{' '}
            curates a nationwide network of movement lawyers, legal clinics, and pro bono advocates. Use the{' '}
            <a href="#find-attorney" className="text-primary underline underline-offset-4">
              Civil Rights Attorney Directory
            </a>{' '}
            and{' '}
            <a href="#states" className="text-primary underline underline-offset-4">
              state recording law guide
            </a>{' '}
            to connect quickly with attorneys aligned to your state’s protest defense, FOIA litigation, and accountability
            needs. Pair your outreach with our{' '}
            <a href="#report-violation" className="text-primary underline underline-offset-4">
              violation reporting tools
            </a>{' '}
            and{' '}
            <a href="#foia-tracker" className="text-primary underline underline-offset-4">
              FOIA tracker workflows
            </a>{' '}
            to document civil liberties violations from intake to public disclosure.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {KEY_PHRASES.map((phrase) => (
            <Badge key={phrase} variant="secondary" className="text-sm font-normal px-3 py-1">
              {phrase}
            </Badge>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">National Civil Rights Legal Networks</h3>
          <ul className="grid gap-4 md:grid-cols-2">
            {nationalNetworks.map((entry) => (
              <li key={entry.name} className="rounded-lg border bg-background p-4 shadow-sm space-y-2">
                <div>
                  <p className="font-semibold text-foreground">{entry.name}</p>
                  {entry.organization && (
                    <p className="text-sm text-muted-foreground">{entry.organization}</p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{entry.description}</p>
                {entry.website && (
                  <a
                    href={entry.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary underline underline-offset-4"
                  >
                    Visit {entry.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">State-by-State Civil Rights Defense Teams</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedStates.map((state) => (
              <div key={state} className="rounded-lg border bg-background p-4 shadow-sm space-y-3">
                <h4 className="text-lg font-semibold text-foreground">{state}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {stateGroups[state].map((entry) => (
                    <li key={entry.name} className="space-y-1">
                      <p>
                        <strong className="text-foreground">{entry.name}</strong>
                        {entry.organization ? ` — ${entry.organization}` : ''}
                      </p>
                      <p>{entry.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {entry.practiceAreas.map((area) => (
                          <span key={area} className="rounded bg-muted px-2 py-0.5 text-muted-foreground">
                            {area}
                          </span>
                        ))}
                        {entry.specialties?.map((specialty) => (
                          <span key={specialty} className="rounded bg-muted px-2 py-0.5 text-muted-foreground">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      {entry.website && (
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4"
                        >
                          {entry.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">Key We The People News Reports</h3>
          <p className="text-muted-foreground">
            Stay updated with the investigative journalism powering this legal directory. These featured reports from We The
            People News connect attorney actions with on-the-ground accountability work and provide essential context for legal
            strategy.
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {WTP_ARTICLES.map((article) => (
              <li key={article.url} className="rounded-lg border bg-background p-4 shadow-sm space-y-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {article.title}
                </a>
                <p className="text-sm text-muted-foreground">{article.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
