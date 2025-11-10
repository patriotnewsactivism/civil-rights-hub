import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, CreditCard } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import html2canvas from "html2canvas";

const stateRightsData: Record<string, {
  recordingLaw: string;
  policeRecording: string;
  importantNotes: string[];
}> = {
  "Alabama": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "You can record police in public spaces",
      "Cannot interfere with official duties",
      "ID required if driving, not walking"
    ]
  },
  "Alaska": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "You can record police in public spaces",
      "Cannot interfere with official duties",
      "Stop and identify law applies"
    ]
  },
  "California": {
    recordingLaw: "Two-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Recording police in public is protected",
      "Private conversations require all-party consent",
      "Stop and identify law applies"
    ]
  },
  "Florida": {
    recordingLaw: "Two-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Recording police in public is legal",
      "Cannot record private conversations",
      "No stop and identify statute"
    ]
  },
  "New York": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Strong right to record police",
      "Cannot be arrested for recording",
      "Stop and identify law applies"
    ]
  },
  "Texas": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Recording police is protected by law",
      "Must provide ID if lawfully arrested",
      "Open carry state - know your rights"
    ]
  }
};

// Add more states with default data
const allStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export const RightsCard = () => {
  const { state: detectedState } = useGeolocation();
  const [selectedState, setSelectedState] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  const currentState = selectedState || detectedState || "";
  const stateData = stateRightsData[currentState] || {
    recordingLaw: "Check local laws",
    policeRecording: "Generally legal in public",
    importantNotes: [
      "You have the right to remain silent",
      "You can refuse searches without a warrant",
      "You can record police in public spaces"
    ]
  };

  const downloadCard = async () => {
    if (!cardRef.current || !currentState) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#1e3a8a",
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Know-Your-Rights-${currentState.replace(/\s+/g, '-')}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating card:', error);
    }
  };

  return (
    <section id="rights-card" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">Pocket Rights Card</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Generate a mobile-optimized rights card for your state. Save it to your phone for quick reference.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your State</CardTitle>
              <CardDescription>
                Choose your state to generate a personalized rights card with state-specific information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder={detectedState || "Select a state..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={downloadCard}
                  disabled={!currentState}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Save to Gallery
                </Button>
              </div>
            </CardContent>
          </Card>

          {currentState && (
            <div className="flex justify-center">
              <div
                ref={cardRef}
                className="w-[800px] h-[500px] bg-gradient-to-br from-blue-900 to-blue-600 rounded-2xl p-8 text-white shadow-2xl"
                style={{
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-3xl font-bold mb-1">KNOW YOUR RIGHTS</div>
                    <div className="text-xl font-semibold text-blue-100">{currentState}</div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-5">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-blue-100 mb-1">Recording Law</div>
                    <div className="text-lg font-bold">{stateData.recordingLaw}</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-blue-100 mb-1">Police Recording</div>
                    <div className="text-lg font-bold">{stateData.policeRecording}</div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-blue-100 mb-2">Essential Rights</div>
                    <ul className="space-y-1.5">
                      {stateData.importantNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-200 mt-0.5">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-white/20 text-center">
                  <div className="text-xs text-blue-100">
                    Civil Rights Hub • civilrights.wtpnews.org
                  </div>
                  <div className="text-xs text-blue-200 mt-1">
                    This is general legal information, not legal advice
                  </div>
                </div>
              </div>
            </div>
          )}

          {!currentState && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a state above to generate your rights card</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
