import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  document.title = mode === "signin" ? "Sign in — n8n Client Hub" : "Create account — n8n Client Hub";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error); else toast.success("Welcome back!");
    } else {
      const { error } = await signUp(email, password);
      if (error) toast.error(error); else toast.success("Check your email to confirm your account.");
    }
  };

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="w-full max-w-md hero-aurora">
        <Card>
          <CardHeader>
            <CardTitle>{mode === "signin" ? "Sign in" : "Create your account"}</CardTitle>
            <CardDescription>Access your client workspace and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button variant="hero" size="xl" className="w-full" type="submit">
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                {mode === "signin" ? (
                  <button type="button" className="underline" onClick={() => setMode("signup")}>New here? Create an account</button>
                ) : (
                  <button type="button" className="underline" onClick={() => setMode("signin")}>Already have an account? Sign in</button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Auth;
