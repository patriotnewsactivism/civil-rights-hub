import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, CreditCard, Share2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

const stateRightsData: Record<string, {
  recordingLaw: string;
  policeRecording: string;
  importantNotes: string[];
}> = {
  "Alabama": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "You can record police in public",
      "ID required if driving, not walking",
      "Cannot interfere with duties"
    ]
  },
  "Alaska": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "You can record police in public",
      "Stop and identify law applies",
      "Cannot interfere with duties"
    ]
  },
  "Arizona": {
    recordingLaw: "One-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Recording police is protected",
      "Cannot record within 8 feet",
      "Stop and identify law applies"
    ]
  },
  "California": {
    recordingLaw: "Two-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Recording police in public is protected",
      "Private conversations need consent",
      "Stop and identify law applies"
    ]
  },
  "Florida": {
    recordingLaw: "Two-party consent",
    policeRecording: "Legal in public",
    importantNotes: [
      "Recording police in public is legal",
      "Cannot record private conversations",
      "No stop and identify law"
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
      "Open carry state"
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
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentState = selectedState || detectedState || "";
  const stateData = stateRightsData[currentState] || {
    recordingLaw: "Check local laws",
    policeRecording: "Generally legal in public",
    importantNotes: [
      "You have the right to remain silent",
      "Refuse searches without warrant",
      "Record police in public spaces"
    ]
  };

  const saveToGallery = async () => {
    if (!cardRef.current || !currentState) {
      toast({
        title: "Please select a state",
        description: "Choose a state to generate your rights card",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#1e3a8a",
        logging: false,
        width: 600,
        height: 900,
      });

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Failed to generate image");
        }

        const fileName = `Rights-Card-${currentState.replace(/\s+/g, '-')}.png`;

        // Try Web Share API first (works great on mobile)
        if (navigator.share && navigator.canShare) {
          try {
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: `${currentState} Rights Card`,
                text: `Know Your Rights - ${currentState}`
              });

              toast({
                title: "Success!",
                description: "Choose 'Save to Photos' or 'Save Image' to add to your camera roll",
              });
              setIsGenerating(false);
              return;
            }
          } catch (shareError) {
            // User cancelled or share failed, fall through to download
            console.log('Share cancelled or failed:', shareError);
          }
        }

        // Fallback: Direct download (works on desktop and some mobile browsers)
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        // For mobile browsers, try to trigger a long-press save
        link.setAttribute('target', '_blank');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Card Generated!",
          description: "On mobile: Tap and hold the image, then select 'Save to Photos' or 'Add to Photos'",
          duration: 6000,
        });

        setIsGenerating(false);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error generating card:', error);
      toast({
        title: "Error",
        description: "Failed to generate card. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
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
              Generate a mobile-sized rights card for your state. Save it to your camera roll for quick reference during encounters.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your State</CardTitle>
              <CardDescription>
                Choose your state to generate a personalized pocket rights card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
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
                  onClick={saveToGallery}
                  disabled={!currentState || isGenerating}
                  className="gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    "Generating..."
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Save to Photos
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {currentState && (
            <div className="flex justify-center">
              <div
                ref={cardRef}
                className="w-[600px] h-[900px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                style={{
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold mb-3 tracking-tight">KNOW YOUR RIGHTS</div>
                    <div className="text-3xl font-bold text-blue-100 mb-2">{currentState}</div>
                    <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-6">
                    {/* Recording Law */}
                    <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                      <div className="text-sm font-bold text-blue-100 mb-2 uppercase tracking-wide">Recording Law</div>
                      <div className="text-2xl font-bold">{stateData.recordingLaw}</div>
                    </div>

                    {/* Police Recording */}
                    <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                      <div className="text-sm font-bold text-blue-100 mb-2 uppercase tracking-wide">Police Recording</div>
                      <div className="text-2xl font-bold">{stateData.policeRecording}</div>
                    </div>

                    {/* Essential Rights */}
                    <div className="bg-white/15 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                      <div className="text-sm font-bold text-blue-100 mb-4 uppercase tracking-wide">Essential Rights</div>
                      <ul className="space-y-3">
                        {stateData.importantNotes.map((note, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-base leading-relaxed">
                            <span className="text-blue-200 text-xl mt-0.5 shrink-0">•</span>
                            <span className="font-medium">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Reminders */}
                    <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border-2 border-white/30">
                      <div className="text-sm font-bold text-blue-100 mb-3 uppercase tracking-wide">Remember</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-200">✓</span>
                          <span>You have the right to remain silent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-200">✓</span>
                          <span>Ask "Am I free to go?"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-200">✓</span>
                          <span>Request a lawyer immediately</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-white/20 text-center space-y-2">
                    <div className="text-sm font-bold">
                      civilrights.wtpnews.org
                    </div>
                    <div className="text-xs text-blue-100">
                      This is general legal information, not legal advice
                    </div>
                    <div className="text-xs text-blue-200">
                      Consult an attorney for specific guidance
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!currentState && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a state above to preview your pocket rights card</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            <p className="mb-2">
              <strong>📱 Mobile Tip:</strong> After tapping "Save to Photos", choose "Save Image" or "Add to Photos" from the share menu.
            </p>
            <p>
              Keep this card on your phone for quick reference during traffic stops or interactions with law enforcement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
