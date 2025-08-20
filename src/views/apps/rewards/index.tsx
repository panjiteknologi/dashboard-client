"use client";

import { Gift, Trophy, Stars } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const rewards = [
  {
    id: "referral",
    title: "Referral Program",
    icon: Gift,
    description:
      "Dapatkan poin setiap kali Anda mereferensikan teman untuk menggunakan layanan kami.",
    badge: "Aktif",
  },
  {
    id: "achievement",
    title: "Achievement Bonus",
    icon: Trophy,
    description:
      "Raih reward ketika menyelesaikan proses sertifikasi dengan skor evaluasi yang tinggi.",
    badge: "Spesial",
  },
  {
    id: "milestone",
    title: "Milestone Reward",
    icon: Stars,
    description:
      "Dapatkan hadiah setiap kali mencapai milestone tertentu dalam sertifikasi atau pembelian.",
  },
];

export default function RewardProgramView() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Reward Program</h1>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card
            key={reward.id}
            className="hover:shadow-md transition duration-200"
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="bg-primary/10 p-2 rounded">
                <reward.icon className="w-5 h-5 text-primary" />
              </div>
              {reward.badge && <Badge>{reward.badge}</Badge>}
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{reward.title}</CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                {reward.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
