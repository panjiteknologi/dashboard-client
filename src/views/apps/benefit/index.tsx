"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gift, CheckCircle } from "lucide-react";

const isoProducts = [
  {
    id: "9001",
    name: "ISO 9001:2015",
    description: "Quality Management System",
    benefits: [
      "Increase customer satisfaction",
      "Improve process efficiency",
      "Enhance market competitiveness",
    ],
  },
  {
    id: "14001",
    name: "ISO 14001:2015",
    description: "Environmental Management System",
    benefits: [
      "Reduce environmental impact",
      "Comply with regulations",
      "Improve corporate image",
    ],
  },
  {
    id: "45001",
    name: "ISO 45001:2018",
    description: "Occupational Health and Safety",
    benefits: [
      "Improve employee safety",
      "Reduce workplace risks",
      "Foster a healthy work environment",
    ],
  },
];

export default function BenefitISOPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Benefit</h1>
      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isoProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-[2px]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
