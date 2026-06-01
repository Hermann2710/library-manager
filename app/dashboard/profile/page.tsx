import { auth } from "@/auth";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { redirect } from "next/navigation";
import { getProfileData } from "./_actions/get-profile-data";
import { ProfileTabs } from "./_components/profile-tabs";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const profileData = await getProfileData();

    return (
        <DashboardContainer
            title="MON PROFIL"
            subtitle="Identite"
            description="Mettez a jour vos informations, consultez votre fiche membre et suivez votre activite."
        >
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ProfileTabs user={session.user} profileData={profileData} />
            </section>
        </DashboardContainer>
    );
}
