"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Box,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  FlaskConical,
  Folder,
  GraduationCap,
  History,
  Landmark,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppsSearchAndView } from "./app-search-view";
import { AppListView } from "./app-list-view";
import { AppsHero } from "./app-hero";

// Define the app interfaces
interface AppCategory {
  id: string;
  title: string;
  apps: App[];
}

interface App {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
  badge?: string;
  isNew?: boolean;
}

// Sample app data
const appCategories: AppCategory[] = [
  {
    id: "main",
    title: "Main Applications",
    apps: [
      {
        id: "dashboard",
        title: "Dashboard",
        description: "Overview of your activities and metrics",
        icon: LayoutDashboard,
        url: "/apps/dashboard",
      },
      {
        id: "mandays",
        title: "Mandays Calculator",
        description: "Calculate project timelines and resource allocations",
        icon: Calendar,
        url: "/apps/mandays",
        isNew: true,
      },
      {
        id: "price-simulation",
        title: "Price Simulation",
        description: "Test pricing scenarios for your products and services",
        icon: LineChart,
        url: "/apps/price-simulation",
      },
    ],
  },
  {
    id: "finance",
    title: "Finance & Administration",
    apps: [
      {
        id: "invoices",
        title: "Invoices",
        description: "Manage and track all your invoices",
        icon: FileText,
        url: "/apps/invoices",
      },
      {
        id: "payments",
        title: "Payments",
        description: "Track payment status and history",
        icon: CreditCard,
        url: "/apps/payments",
      },
      {
        id: "expense-reports",
        title: "Expense Reports",
        description: "Submit and track expense reports",
        icon: Wallet,
        url: "/apps/expenses",
      },
    ],
  },
  {
    id: "certification",
    title: "Certification Services",
    apps: [
      {
        id: "audit-process",
        title: "Audit Process",
        description: "Manage and track certification audits",
        icon: ListChecks,
        url: "/apps/audit",
      },
      {
        id: "certifications",
        title: "Certifications",
        description: "View and manage all your certifications",
        icon: Award,
        url: "/apps/certifications",
      },
      {
        id: "audit-history",
        title: "Audit History",
        description: "Review past audits and findings",
        icon: History,
        url: "/apps/audit-history",
      },
      {
        id: "scope-library",
        title: "Scope Library",
        description: "Access certification standards and requirements",
        icon: BookOpen,
        url: "/apps/scope",
        badge: "Premium",
      },
    ],
  },
  {
    id: "training",
    title: "Training & Development",
    apps: [
      {
        id: "courses",
        title: "Training Courses",
        description: "Browse and enroll in certification courses",
        icon: GraduationCap,
        url: "/apps/courses",
      },
      {
        id: "webinars",
        title: "Webinars",
        description: "Register for upcoming webinars and workshops",
        icon: Users,
        url: "/apps/webinars",
        isNew: true,
      },
      {
        id: "resources",
        title: "Learning Resources",
        description: "Access educational materials and guides",
        icon: Folder,
        url: "/apps/resources",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    apps: [
      {
        id: "performance",
        title: "Performance Analytics",
        description: "Track and analyze business performance metrics",
        icon: BarChart3,
        url: "/apps/analytics",
      },
      {
        id: "compliance",
        title: "Compliance Reports",
        description: "Generate compliance status reports",
        icon: FileText,
        url: "/apps/compliance-reports",
      },
      {
        id: "industry-benchmarks",
        title: "Industry Benchmarks",
        description: "Compare your metrics with industry standards",
        icon: Building2,
        url: "/apps/benchmarks",
        badge: "Premium",
      },
    ],
  },
  {
    id: "tools",
    title: "Tools & Utilities",
    apps: [
      {
        id: "settings",
        title: "Account Settings",
        description: "Manage your account preferences and settings",
        icon: Settings,
        url: "/apps/settings",
      },
      {
        id: "api",
        title: "API Access",
        description: "Integrate TSI services with your systems",
        icon: Box,
        url: "/apps/api",
        badge: "Beta",
      },
      {
        id: "calculator",
        title: "ROI Calculator",
        description: "Calculate return on investment for certification",
        icon: Landmark,
        url: "/apps/roi-calculator",
      },
      {
        id: "lab",
        title: "TSI Labs",
        description: "Try experimental features and tools",
        icon: FlaskConical,
        url: "/apps/labs",
        isNew: true,
      },
    ],
  },
];

const AppsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter apps based on search query
  const filteredCategories = appCategories
    .map((category) => {
      const filteredApps = category.apps.filter(
        (app) =>
          app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...category,
        apps: filteredApps,
      };
    })
    .filter((category) => category.apps.length > 0);

  return (
    <div className="space-y-8">
      <AppsHero />
      <AppsSearchAndView
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No applications found matching your search.
          </p>
        </div>
      ) : viewMode === "list" ? (
        <AppListView categories={filteredCategories} />
      ) : (
        filteredCategories.map((category) => (
          <section key={category.id} className="space-y-4 mb-16">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{category.title}</h2>
              <Separator className="bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.apps.map((app) => (
                <Link
                  key={app.id}
                  href={app.url}
                  className="block transition hover:scale-[1.01] duration-200"
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary/10 p-2 rounded">
                          <app.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex space-x-2">
                          {app.isNew && (
                            <Badge variant="default" className="bg-primary">
                              New
                            </Badge>
                          )}
                          {app.badge && (
                            <Badge variant="outline">{app.badge}</Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">
                        {app.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-muted-foreground">
                        {app.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default AppsView;
