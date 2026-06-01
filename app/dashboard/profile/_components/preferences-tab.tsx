import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PreferencesTab() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg">Apparence</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold">Theme de l'application</p>
          <p className="text-sm text-muted-foreground">Choisissez le mode clair, sombre ou systeme.</p>
        </div>
        <ThemeToggle showLabel />
      </CardContent>
    </Card>
  );
}
