import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import type { ProfileData } from "../_actions/get-profile-data";
import { formatDate } from "./profile-types";

export function MemberTab({ member }: { member: ProfileData["member"] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-primary" /> Fiche membre
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {member ? (
          <>
            <Info label="Code membre" value={member.memberId} />
            <Info label="Statut" value={member.status} />
            <Info label="Telephone" value={member.phone} />
            <Info label="Adresse" value={member.address || "Non renseignee"} />
            <Info label="Inscrit le" value={formatDate(member.createdAt)} />
            <Info label="Expiration" value={formatDate(member.membershipExpiresAt)} />
          </>
        ) : (
          <p className="col-span-full text-sm text-muted-foreground">Aucune fiche membre n'est encore liee a ce compte.</p>
        )}
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}
