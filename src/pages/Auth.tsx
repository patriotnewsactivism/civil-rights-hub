import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield, FileText, ArrowRight, Loader2, AlertCircle, KeyRound } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AuthMode = "signin" | "signup" | "forgot" | "reset";

export default function Auth() {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    requestPasswordReset,
    updatePassword,
    user,
    loading: authLoading,
    isPasswordRecovery,
  } = useAuth();

  const initialMode = useMemo<AuthMode>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode") === "reset" ? "reset" : "signin";
  }, []);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPasswordRecovery) setMode("reset");
  }, [isPasswordRecovery]);

  useEffect(() => {
    if (!authLoading && user && mode !== "reset" && !isPasswordRecovery) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, mode, isPasswordRecovery, navigate]);

  const run = async (operation: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await operation();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Authentication request failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    void run(async () => {
      const { error: signInError } = await signIn(email.trim(), password);
      if (signInError) throw signInError;
      toast.success("Signed in.");
      navigate("/", { replace: true });
    });
  };

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();
    void run(async () => {
      if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
      const { error: signUpError } = await signUp(email.trim(), password, displayName.trim() || undefined);
      if (signUpError) throw signUpError;
      toast.success("Registration submitted. Check your email if confirmation is required.");
      setMode("signin");
      setPassword("");
    });
  };

  const handleForgotPassword = (event: React.FormEvent) => {
    event.preventDefault();
    void run(async () => {
      const { error: resetError } = await requestPasswordReset(email.trim());
      if (resetError) throw resetError;
      toast.success("If that address is registered, a secure password-reset link has been sent.");
      setMode("signin");
    });
  };

  const handlePasswordUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    void run(async () => {
      if (!user) throw new Error("Open the password-reset link from your email before setting a new password.");
      if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
      if (password !== confirmPassword) throw new Error("The new passwords do not match.");
      const { error: updateError } = await updatePassword(password);
      if (updateError) throw updateError;
      toast.success("Password updated. Your account is ready to use.");
      setPassword("");
      setConfirmPassword("");
      navigate("/", { replace: true });
    });
  };

  const busy = loading || authLoading;
  const showReset = mode === "reset" || isPasswordRecovery;

  return (
    <div className="min-h-screen flex w-full">
      <SEO
        title="Account Access | Civil Rights Hub"
        description="Sign in, register, or securely recover your Civil Rights Hub account."
        canonicalUrl="https://civilrightshub.org/auth"
      />

      <div className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.1),transparent_50%)]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
            <Shield className="h-8 w-8 text-primary" />
            <span>Civil Rights Hub</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Organize your <span className="text-primary">public-interest work</span>.
          </h1>
          <p className="text-lg text-slate-300">
            Account features support public-records workflows, private incident reporting, and community participation without treating user submissions as verified public fact.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-semibold text-sm">Records Workflows</h3>
                <p className="text-xs text-slate-400 mt-1">Keep account-specific requests and saved work tied to you.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Shield className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="font-semibold text-sm">Secure Recovery</h3>
                <p className="text-xs text-slate-400 mt-1">Reset credentials through a short-lived email recovery session.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Civil Rights Hub. Public source repository on GitHub.
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6"><Shield className="h-12 w-12 text-primary" /></div>
            <h2 className="text-2xl font-bold tracking-tight">{showReset ? "Set a new password" : "Account access"}</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {showReset ? "Choose a new password for the account linked by your recovery email." : "Sign in, create an account, or recover access securely."}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showReset ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-password">New password</Label>
                <Input id="reset-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-confirm-password">Confirm new password</Label>
                <Input id="reset-confirm-password" type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy || !user}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Update password
              </Button>
              {!user && !authLoading && (
                <p className="text-xs text-muted-foreground">This reset session is missing or expired. Request a fresh link below.</p>
              )}
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("forgot")}>Request another reset link</Button>
            </form>
          ) : mode === "forgot" ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email address</Label>
                <Input id="forgot-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Send reset link
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("signin")}>Back to sign in</Button>
            </form>
          ) : (
            <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email address</Label>
                    <Input id="signin-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="signin-password">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline" onClick={() => { setError(null); setMode("forgot"); }}>Forgot password?</button>
                    </div>
                    <Input id="signin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    {busy ? "Verifying..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display name</Label>
                    <Input id="signup-name" type="text" autoComplete="name" placeholder="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email address</Label>
                    <Input id="signup-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Choose password</Label>
                    <Input id="signup-password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {busy ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          <p className="px-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to the <Link to="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{" "}
            and <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
