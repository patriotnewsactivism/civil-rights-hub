import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Mail, Scale, Users, Shield } from "lucide-react";

export const Resources = () => {
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
      name: "Attorney-Shield",
      description: "Legal protection and support for citizens recording police and public officials",
      website: "https://attorney-shield.com",
      icon: Shield
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
