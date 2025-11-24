"use client";

import { Crown, ShieldCheck, User, CheckCircle2, Sparkles, GraduationCap, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Current user membership status
const currentMembership = "PREMIUM";

const membershipTiers = [
  {
    id: "BASIC",
    title: "Basic",
    icon: User,
    gradient: "from-gray-500 to-gray-600",
    benefits: [
      "Akses dashboard standar",
      "Notifikasi sertifikasi",
      "Pembaruan reguler",
    ],
  },
  {
    id: "REGULAR",
    title: "Regular",
    icon: ShieldCheck,
    gradient: "from-blue-500 to-blue-600",
    benefits: [
      "Semua benefit Basic",
      "Konsultasi ahli (terbatas)",
      "Akses webinar bulanan",
      "Dokumen template ISO",
    ],
  },
  {
    id: "PREMIUM",
    title: "Premium",
    icon: Crown,
    gradient: "from-amber-500 via-yellow-500 to-amber-600",
    benefits: [
      "Semua benefit Regular",
      "Training gratis (akses e-learning)",
      "Konsultasi ahli unlimited",
      "Webinar eksklusif",
      "Dokumen ISO lengkap",
      "Priority support 24/7",
    ],
  },
];

// Animation keyframes
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    }
    50% {
      box-shadow: 0 0 40px rgba(251, 191, 36, 0.8);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .delay-100 {
    animation-delay: 0.1s;
    opacity: 0;
  }

  .delay-200 {
    animation-delay: 0.2s;
    opacity: 0;
  }

  .delay-300 {
    animation-delay: 0.3s;
    opacity: 0;
  }

  .delay-400 {
    animation-delay: 0.4s;
    opacity: 0;
  }

  @keyframes slide-right {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(5px);
    }
  }

  @keyframes bounce-gentle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  .animate-slide-right {
    animation: slide-right 1.5s ease-in-out infinite;
  }

  .animate-bounce-gentle {
    animation: bounce-gentle 2s ease-in-out infinite;
  }
`;

export default function MembershipView() {
  const activeMembership = membershipTiers.find(
    (tier) => tier.id === currentMembership
  );

  return (
    <>
      <style>{styles}</style>
      <div className="space-y-8 pb-8">
        {/* Header Section */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Membership Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Kelola dan lihat status keanggotaan Anda
          </p>
        </div>

        <Separator className="animate-fade-in-up delay-100" />

        {/* Current Membership Status Card */}
        {activeMembership && (
          <Card className="border-0 shadow-2xl overflow-hidden relative animate-fade-in-up delay-200 hover:shadow-amber-500/20 transition-all duration-500">
            {/* Gradient Gold Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 opacity-95" />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 animate-shimmer" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-900/20 rounded-full blur-3xl"
                 style={{ animationDelay: '1.5s' }} />

            {/* Content */}
            <div className="relative z-10">
              <div className="h-1.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300" />

              <CardHeader className="pb-4 pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-lg animate-pulse-glow">
                      <activeMembership.icon className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl text-white drop-shadow-md mb-1">
                        Status Membership Anda
                      </CardTitle>
                      <CardDescription className="text-amber-50 text-base">
                        Member aktif sejak Januari 2025
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-white/90 text-amber-700 border-0 px-5 py-2 text-base font-bold shadow-xl hover:bg-white transition-all duration-300 w-fit">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {activeMembership.title}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 px-6 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow-md">
                      Benefit Premium Anda
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeMembership.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/95 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                      >
                        <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm font-semibold text-gray-800 leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlight Training Benefit */}
                <Card className="bg-white/95 backdrop-blur-sm border-white/60 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 group overflow-hidden relative">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                  <CardContent className="pt-6 pb-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-3 rounded-xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-amber-900 mb-2 flex items-center gap-2">
                          Training Gratis - Akses E-Learning
                          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                        </h4>
                        <p className="text-sm text-amber-800 mb-4 font-medium leading-relaxed">
                          Dapatkan akses penuh ke platform e-learning kami dengan ratusan kursus
                          dan materi pelatihan ISO terkini.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-3 py-1">
                            <Zap className="w-3 h-3 mr-1" />
                            100+ Kursus
                          </Badge>
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-3 py-1">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Sertifikat Tersedia
                          </Badge>
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-3 py-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Update Berkala
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </div>
          </Card>
        )}

        {/* All Membership Tiers Comparison */}
        <div className="animate-fade-in-up delay-300">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Semua Tier Membership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membershipTiers.map((tier, tierIndex) => {
              const isActive = tier.id === currentMembership;
              const isPremium = tier.id === "PREMIUM";
              return (
                <Card
                  key={tier.id}
                  className={`hover:shadow-2xl transition-all duration-500 overflow-hidden relative group h-full
                    ${isActive ? "ring-2 ring-amber-400 shadow-xl" : "hover:scale-[1.02]"}
                    ${isPremium ? "border-2 border-amber-400" : "border"}
                    animate-fade-in-up`}
                  style={{ animationDelay: `${0.4 + tierIndex * 0.1}s` }}
                >
                  {/* Premium Card Background */}
                  {isPremium && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 opacity-90" />
                      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl animate-float" />
                      <div className="absolute inset-0 animate-shimmer" />
                    </>
                  )}

                  <div className="relative z-10 h-full flex flex-col">
                    <div className={`h-2 bg-gradient-to-r ${tier.gradient} ${isPremium ? "shadow-md" : ""}`} />

                    <CardHeader className="pb-4 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`bg-gradient-to-r ${tier.gradient} p-3 rounded-xl shadow-lg
                          ${isPremium ? "shadow-amber-300 animate-pulse-glow" : ""}
                          group-hover:scale-110 transition-transform duration-300`}>
                          <tier.icon className="w-6 h-6 text-white" />
                        </div>
                        {isActive && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg animate-bounce-gentle relative">
                            <span className="flex items-center animate-slide-right">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={`text-2xl flex items-center gap-2 mb-2
                        ${isPremium ? "text-amber-900" : "text-gray-900"}`}>
                        {tier.title}
                        {isPremium && <Crown className="w-6 h-6 text-amber-600 animate-pulse" />}
                      </CardTitle>
                      <CardDescription className={`text-base ${isPremium ? "text-amber-700 font-semibold" : "text-muted-foreground"}`}>
                        {tier.id === "BASIC" && "Mulai perjalanan Anda"}
                        {tier.id === "REGULAR" && "Tingkatkan produktivitas"}
                        {tier.id === "PREMIUM" && "Pengalaman terbaik & paling lengkap"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <ul className="space-y-3 mb-4">
                          {tier.benefits.slice(0, 4).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm group/item">
                              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-125
                                ${isPremium ? "text-amber-600" : "text-green-600"}`} />
                              <span className={`leading-relaxed ${isPremium ? "text-gray-800 font-semibold" : "text-muted-foreground"}`}>
                                {benefit}
                              </span>
                            </li>
                          ))}
                          {tier.benefits.length > 4 && (
                            <li className={`text-sm pl-7 font-semibold ${isPremium ? "text-amber-700" : "text-muted-foreground"}`}>
                              +{tier.benefits.length - 4} benefit lainnya
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="space-y-3 mt-auto">
                        {isPremium && (
                          <div className="pt-4 border-t border-amber-200">
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 w-full justify-center py-2.5 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                              Rekomendasi Terbaik
                            </Badge>
                          </div>
                        )}

                        {!isActive && (
                          <div className="pt-4 border-t">
                            <button className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300
                              ${isPremium
                                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:shadow-lg hover:scale-105"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}>
                              Upgrade ke {tier.title}
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
