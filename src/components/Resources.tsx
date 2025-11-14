import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Mail, Scale, Users, Shield, Gavel, Megaphone } from "lucide-react";

export const Resources = () => {
  const featuredResource = {
    name: "Attorney Shield",
    tagline: "On-demand legal backup for accountability advocates",
    description:
      "Attorney Shield connects residents, journalists, and community organizations with rapid-response lawyers who can intervene when encounters escalate.",
    website: "https://attorney-shield.com",
    benefits: [
      "Immediate access to vetted civil rights attorneys when documenting incidents",
      "Secure evidence vault for storing videos, statements, and timelines",
      "Affordable memberships for individuals, grassroots organizers, and small businesses",
    ],
  };

  const organizations = [
    {
      name: "American Civil Liberties Union (ACLU)",
      description: "Defending individual rights and liberties guaranteed by the Constitution",
      website: "https://www.aclu.org",
      icon: Scale
    },
    {
      name: "National Lawyers Guild (NLG)",
      description: "Progressive legal organization providing legal support for activists",
      website: "https://www.nlg.org",
      icon: Users
    },
    {
      name: "Electronic Frontier Foundation (EFF)",
      description: "Defending civil liberties in the digital world",
      website: "https://www.eff.org",
      icon: Scale
    },
    {
      name: "Know Your Rights Camp Legal Defense Initiative",
      description: "Emergency legal support and bail assistance for communities impacted by racial injustice",
      website: "https://www.knowyourrightscamp.com/legal",
      icon: Shield
    },
    {
      name: "Community Justice Exchange",
      description: "National directory of community bail funds and rapid-response legal collectives",
      website: "https://communityjusticeexchange.org",
      icon: Users
    }
  ];

  const emergencyContacts = [
    {
      title: "Legal Aid Hotline",
      contact: "1-888-534-5596",
      description: "Free legal assistance for civil rights issues",
      icon: Phone
    },
    {
      title: "ACLU Emergency Support",
      contact: "Contact local chapter",
      description: "Immediate assistance for rights violations",
      icon: Mail
    }
  ];

  const advertisingHighlights = [
    "Spotlight trusted legal partners like Attorney Shield directly within community safety tools",
    "Reach residents who actively seek attorneys for civil rights, employment, and personal injury cases",
    "Custom packages for law firms, legal clinics, and pro bono networks to feature educational content",
  ];

  return (
    <section id="resources" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prevention, Safety & Legal Resources
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with organizations and resources dedicated to protecting civil rights,
            providing legal assistance, and supporting prevention and safety measures.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background shadow-soft">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    {featuredResource.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {featuredResource.tagline}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => window.open(featuredResource.website, '_blank')}
                  className="w-full md:w-auto"
                >
                  Explore Attorney Shield
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-[1fr_1fr] gap-6">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {featuredResource.description}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  What members receive
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {featuredResource.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 text-primary">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Prevention, Safety & Legal Aid Organizations</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {organizations.map((org, index) => (
                <Card key={index} className="shadow-soft hover:shadow-strong transition-all duration-300 border-border">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                      <org.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>{org.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full group"
                      onClick={() => window.open(org.website, '_blank')}
                    >
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Emergency Contacts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="shadow-soft border-accent/30 bg-gradient-to-br from-background to-accent/5">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <contact.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{contact.title}</CardTitle>
                        <p className="text-2xl font-bold text-accent mb-1">{contact.contact}</p>
                        <CardDescription>{contact.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-dashed border-primary/40 bg-background">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Megaphone className="h-6 w-6 text-primary" />
                    Legal Advertising & Partnership Opportunities
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Help residents find trustworthy attorneys while funding civil rights programming.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.open('mailto:partners@civilrightshub.org?subject=Legal%20Advertising%20Inquiry')}
                  className="w-full md:w-auto"
                >
                  Start a Conversation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {advertisingHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground shadow-strong border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Need Immediate Legal Assistance?</CardTitle>
              <CardDescription className="text-primary-foreground/90 text-base">
                If you believe your rights have been violated, document everything and contact a
                legal aid organization immediately. Time-sensitive cases require quick action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-primary-foreground/90">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Document the incident with dates, times, locations, and witness information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Save any recordings, photos, or written communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Contact a legal aid organization or attorney as soon as possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Do not discuss your case publicly on social media before consulting an attorney</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
