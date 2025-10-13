import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Video, Phone } from "lucide-react";

const stateData: Record<string, { recording: string; policeRecording: string; notes: string }> = {
  "Alabama": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Alaska": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Arizona": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Arkansas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "California": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Police recording in public is protected by First Amendment." },
  "Colorado": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Connecticut": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Public recordings of police are protected." },
  "Delaware": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Recording police in public is legal." },
  "Florida": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "Georgia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Hawaii": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Idaho": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Illinois": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "Illinois requires all-party consent. Recording police officers in public is legal." },
  "Indiana": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Iowa": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Kansas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Kentucky": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Louisiana": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Maine": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Maryland": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police in public is constitutionally protected." },
  "Massachusetts": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "Michigan": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "Minnesota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Mississippi": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Missouri": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Montana": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police in public is legal." },
  "Nebraska": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Nevada": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "New Hampshire": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "New Jersey": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "New Mexico": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "New York": { recording: "One-party consent", policeRecording: "Legal in public", notes: "Only one party needs to consent to recordings. Recording police is constitutionally protected." },
  "North Carolina": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "North Dakota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Ohio": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Oklahoma": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Oregon": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Public recordings of police are protected." },
  "Pennsylvania": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Recording police in public is legal." },
  "Rhode Island": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "South Carolina": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "South Dakota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Tennessee": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Texas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Utah": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Vermont": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Virginia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Washington": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "West Virginia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Wisconsin": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Wyoming": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." }
};

interface StateSelectorProps {
  selectedState?: string;
}

export const StateSelector = ({ selectedState: initialState = "" }: StateSelectorProps) => {
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const stateInfo = selectedState ? stateData[selectedState as keyof typeof stateData] : null;
  
  // Update selected state when prop changes
  useState(() => {
    if (initialState) setSelectedState(initialState);
  });

  return (
    <section id="states" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            State-Specific Laws
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recording laws and civil rights protections vary by state. Select your state to view
            specific regulations and important information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-strong border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6 text-primary" />
                Select Your State
              </CardTitle>
              <CardDescription>
                Choose a state to view recording laws and civil rights information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Choose your state..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(stateData).map((state) => (
                    <SelectItem key={state} value={state} className="text-lg">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {stateInfo && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Private Recording Law</h4>
                          <Badge variant={stateInfo.recording.includes("Two-party") ? "destructive" : "default"}>
                            {stateInfo.recording}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Recording Police</h4>
                          <Badge variant="default" className="bg-primary">
                            {stateInfo.policeRecording}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Important Notes</h4>
                    <p className="text-muted-foreground">{stateInfo.notes}</p>
                  </div>

                  <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong className="text-accent">Disclaimer:</strong> This information is for educational
                      purposes only and does not constitute legal advice. Laws are subject to change.
                      Consult with a qualified attorney for specific legal guidance.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
