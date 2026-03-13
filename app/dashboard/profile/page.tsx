import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { ProfileForm } from "@/components/dashboard/profile/profile-form";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <DashboardContainer
            title="MON PROFIL"
            subtitle="Identité"
            description="Mettez à jour vos informations personnelles et gérez l'apparence de votre compte."
        >
            <ProfileForm user={session.user} />
        </DashboardContainer>
    );
}