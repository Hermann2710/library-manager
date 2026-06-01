import { AuthShell } from "../_components/auth-shell";
import { LoginForm } from "../_components/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Connexion equipe"
      title="Reprendre la gestion"
      description="Accedez au dashboard de la librairie, aux prets en cours et aux actions autorisees par votre role."
      mode="login"
    >
      <LoginForm />
    </AuthShell>
  );
}
