import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    setBusy(false);
    if (error) {
      toast(
        error.code === "23505" ? "You're already on the list." : "Something went wrong, try again.",
      );
      return;
    }
    setEmail("");
    toast("You're in. Watch this space for updates from the pits.");
  }

  return (
    <section className="border border-border/70 bg-surface/60 p-8 sm:p-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl">Stay in the loop</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Build updates, race results and season news, straight to your inbox.
          </p>
        </div>
        <form onSubmit={submit} className="flex w-full max-w-md gap-2">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 bg-background"
          />
          <Button type="submit" disabled={busy} className="h-12 bg-ember font-display uppercase tracking-widest">
            {busy ? "..." : "Sign up"}
          </Button>
        </form>
      </div>
    </section>
  );
}
