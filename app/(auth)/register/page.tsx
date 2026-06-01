import { AuthShell } from "../_components/auth-shell";
import { RegisterForm } from "../_components/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Nouvel acces"
      title="Creer un compte membre"
      description="Renseignez les informations utiles pour rattacher le compte a la structure et suivre les activites."
      mode="register"
    >
      <RegisterForm />
    </AuthShell>
  );
}
