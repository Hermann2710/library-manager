import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";

/**
 * ProfilePage Component.
 * A dedicated space for users to manage their identity. 
 * It ensures only authenticated users can access the form and handles 
 * the initial data injection from the session.
 */
export default async function ProfilePage() {
    // Verifying the session on the server to prevent flashing of unauthorized content
    const session = await auth();

    // Safety check: if there's no active user, we bounce them back to the login page
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <DashboardContainer
            title="MON PROFIL"
            subtitle="Identité"
            description="Mettez à jour vos informations personnelles et gérez l'apparence de votre compte."
        >
            {/* The ProfileForm is a Client Component that handles the actual logic.
                We pass the user object from the session as initial values.
            */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ProfileForm user={session.user} />
            </section>
        </DashboardContainer>
    );
}