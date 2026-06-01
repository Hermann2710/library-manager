import { ImageUpload } from "@/components/shared/image-upload";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { UseFormReturn } from "react-hook-form";
import type { ProfileFormValues, ProfileUser } from "./profile-types";

type ProfileSidebarProps = {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  user: ProfileUser;
};

export function ProfileSidebar({ form, isEditing, user }: ProfileSidebarProps) {
  const currentImage = form.watch("image");

  return (
    <Card className="h-fit rounded-lg">
      <CardContent className="flex flex-col items-center gap-5 p-6 text-center">
        <ImageUpload
          value={currentImage}
          onChange={(url) => form.setValue("image", url, { shouldDirty: true })}
          onRemove={() => form.setValue("image", "", { shouldDirty: true })}
          className={!isEditing ? "pointer-events-none opacity-90" : ""}
        />
        <div className="w-full space-y-2">
          <h2 className="break-words text-2xl font-black uppercase tracking-tight">
            {form.watch("name") || user.name || "Utilisateur"}
          </h2>
          <Badge variant="secondary" className="rounded-md uppercase">
            {user.role || "reader"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
