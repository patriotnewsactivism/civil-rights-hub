import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AITools = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: "Enter a question",
        description: "Please enter a question about your civil rights",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("legal-assistant", {
        body: { question },
      });

      if (error) throw error;

      setAnswer(data.answer);
    } catch (error) {
      console.error("Assistant error:", error);
      toast({
        title: "Failed to get answer",
        description: "Unable to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-tools" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-strong border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MessageCircle className="h-6 w-6 text-primary" />
                AI Legal Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about your civil rights and get AI-powered answers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ask a question about your rights (e.g., 'Can I record a traffic stop?', 'What are my Miranda rights?')..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className="resize-none"
              />
              
              <Button onClick={handleAsk} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MessageCircle className="h-4 w-4 mr-2" />
                )}
                Ask AI Assistant
              </Button>

              {answer && (
                <div className="mt-6 p-6 bg-muted/50 rounded-lg border border-border animate-fade-in">
                  <div className="prose prose-sm max-w-none text-foreground">
                    <div className="whitespace-pre-wrap">{answer}</div>
                  </div>
                  <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded text-sm text-foreground">
                    <strong className="text-accent">Disclaimer:</strong> This is educational information and not legal advice. Consult with a qualified attorney for specific legal guidance.
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
