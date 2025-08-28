"use client";

import { UserPlus, Crown, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const memberships = [
  {
    id: "basic",
    title: "Basic Membership",
    icon: UserPlus,
    description:
      "Akses fitur standar, pembaruan reguler, dan notifikasi sertifikasi.",
  },
  {
    id: "premium",
    title: "Premium Membership",
    icon: ShieldCheck,
    description:
      "Akses premium untuk konsultasi ahli, webinar eksklusif, dan dokumen ISO.",
    badge: "Terpopuler",
  },
  {
    id: "vip",
    title: "VIP Membership",
    icon: Crown,
    description:
      "Layanan personal, pelatihan privat, serta akses prioritas semua fitur.",
    badge: "Eksklusif",
  },
];

export default function MembershipView() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Membership</h1>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {memberships.map((member) => (
          <Card
            key={member.id}
            className="hover:shadow-md transition duration-200"
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="bg-primary/10 p-2 rounded">
                <member.icon className="w-5 h-5 text-primary" />
              </div>
              {member.badge && <Badge variant="default">{member.badge}</Badge>}
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{member.title}</CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                {member.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
