"use client";

import { updateProfile } from "@/actions/user-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Activity, IdCard, Palette, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProfileData } from "../_actions/get-profile-data";
import { ActivityTab } from "./activity-tab";
import { IdentityTab } from "./identity-tab";
import { MemberTab } from "./member-tab";
import { PreferencesTab } from "./preferences-tab";
import { ProfileSidebar } from "./profile-sidebar";
import { profileSchema, type ProfileFormValues, type ProfileUser } from "./profile-types";

export function ProfileTabs({ user, profileData }: { user: ProfileUser; profileData: ProfileData }) {
  const { update } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      const res = await updateProfile(values);

      if (res.success) {
        await update({ ...user, ...values });
        toast.success("Profil et session synchronises");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <ProfileSidebar form={form} isEditing={isEditing} user={user} />

      <Tabs defaultValue="identity" className="min-w-0">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-lg bg-muted/40 p-1 sm:grid-cols-4">
          <TabsTrigger value="identity" className="gap-2 rounded-md">
            <UserRound className="h-4 w-4" /> Identite
          </TabsTrigger>
          <TabsTrigger value="member" className="gap-2 rounded-md">
            <IdCard className="h-4 w-4" /> Membre
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 rounded-md">
            <Activity className="h-4 w-4" /> Activite
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 rounded-md">
            <Palette className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-6">
          <IdentityTab
            form={form}
            isEditing={isEditing}
            onCancel={() => {
              form.reset();
              setIsEditing(false);
            }}
            onEdit={() => setIsEditing(true)}
            onSubmit={onSubmit}
            user={user}
          />
        </TabsContent>

        <TabsContent value="member" className="mt-6">
          <MemberTab member={profileData.member} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTab profileData={profileData} />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
