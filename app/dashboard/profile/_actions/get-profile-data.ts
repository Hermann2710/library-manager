"use server";

import { auth } from "@/auth";
import { Loan } from "@/lib/models/Loan";
import { Member } from "@/lib/models/Member";
import dbConnect from "@/lib/mongodb";
import "@/lib/models/Item";
import "@/lib/models/Work";

export type ProfileLoan = {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
};

export type ProfileData = {
  member?: {
    memberId: string;
    phone: string;
    address?: string;
    status: string;
    membershipExpiresAt?: string;
    createdAt?: string;
  };
  stats: {
    activeLoans: number;
    pendingLoans: number;
    overdueLoans: number;
    returnedLoans: number;
  };
  recentLoans: ProfileLoan[];
};

export async function getProfileData(): Promise<ProfileData> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      stats: { activeLoans: 0, pendingLoans: 0, overdueLoans: 0, returnedLoans: 0 },
      recentLoans: [],
    };
  }

  await dbConnect();

  const member = await Member.findOne({ user: session.user.id }).lean();

  if (!member) {
    return {
      stats: { activeLoans: 0, pendingLoans: 0, overdueLoans: 0, returnedLoans: 0 },
      recentLoans: [],
    };
  }

  const [activeLoans, pendingLoans, overdueLoans, returnedLoans, recentLoans] = await Promise.all([
    Loan.countDocuments({ member: member._id, status: "Active" }),
    Loan.countDocuments({ member: member._id, status: "Pending" }),
    Loan.countDocuments({ member: member._id, status: "Overdue" }),
    Loan.countDocuments({ member: member._id, status: "Returned" }),
    Loan.find({ member: member._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate({
        path: "item",
        select: "work barcode",
        populate: { path: "work", select: "title" },
      })
      .lean(),
  ]);

  return {
    member: {
      memberId: member.memberId,
      phone: member.phone,
      address: member.address,
      status: member.status,
      membershipExpiresAt: member.membershipExpiresAt?.toISOString(),
      createdAt: member.createdAt?.toISOString(),
    },
    stats: { activeLoans, pendingLoans, overdueLoans, returnedLoans },
    recentLoans: recentLoans.map((loan) => ({
      id: String(loan._id),
      title: (loan.item as any)?.work?.title || "Ouvrage non renseigne",
      status: loan.status,
      dueDate: loan.dueDate?.toISOString(),
    })),
  };
}
