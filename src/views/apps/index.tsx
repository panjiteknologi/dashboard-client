"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Calendar,
  CreditCard,
  Folder,
  Gift,
  GraduationCap,
  History,
  LibraryIcon,
  LineChart,
  ListChecks,
  NotebookTextIcon,
  Settings,
  User2,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppsSearchAndView } from "./app-search-view";
import { AppListView } from "./app-list-view";
import { AppsHero } from "./app-hero";
import WhatsappButton from "@/components/ui/whatsapp-button";

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
        id: "application-form",
        title: "Application Form",
        description: "Manage and track application form",
        icon: NotebookTextIcon,
        url: "/apps/application-form",
      },
      {
        id: "our-auditor",
        title: "Our Auditor",
        description:
          "Designed for auditors — monitor workflows, assess compliance, and ensure every audit runs smoothly and transparently.",
        icon: User2,
        url: "/apps/our-auditor",
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
      {
        id: "quotation",
        title: "Quotation",
        description:
          "Simplify the creation and management of detailed price quotations to support informed decision-making.",
        icon: LineChart,
        url: "/apps/quotation",
      },
    ],
  },
  {
    id: "certification",
    title: "Certification Services",
    apps: [
      {
        id: "scope",
        title: "Scope Library",
        description: "Overview of your activities and metrics",
        icon: LibraryIcon,
        url: "/apps/scope",
        badge: "Premium",
      },
      {
        id: "tracking-certificate",
        title: "Tracking Certificate",
        description: "View and manage all your certifications",
        icon: Award,
        url: "/apps/tracking-certificate/audit-status",
      },
      {
        id: "audit-process",
        title: "Audit Process",
        description: "Manage and track certification audits",
        icon: ListChecks,
        url: "/apps/audit-process/audit-stage-1/capa-and-report",
      },
      {
        id: "audit-history",
        title: "Audit History",
        description: "Review past audits and findings",
        icon: History,
        url: "/apps/audit-history",
      },
    ],
  },
  {
    id: "finance",
    title: "Finance & Administration",
    apps: [
      {
        id: "payments",
        title: "Payments",
        description: "Track payment status and history",
        icon: CreditCard,
        url: "/apps/payments",
      },
    ],
  },
  {
    id: "library",
    title: "Library",
    apps: [
      {
        id: "videok3",
        title: "Video K3",
        description:
          "Watch curated safety training and K3 (Occupational Health and Safety) videos.",
        icon: Video,
        url: "/apps/library/video-k3",
      },
      {
        id: "regulation",
        title: "Regulation",
        description:
          "Browse up-to-date regulations and compliance requirements relevant to your industry.",
        icon: Folder,
        url: "/apps/library/regulation",
      },
      {
        id: "webinars",
        title: "Webinars",
        description:
          "Register and participate in upcoming webinars and professional workshops.",
        icon: Users,
        url: "/apps/library/webinars",
        badge: "Premium",
      },
      {
        id: "standard-iso",
        title: "Standard ISO",
        description:
          "Access and review various ISO standards for certification and compliance.",
        icon: GraduationCap,
        url: "/apps/library/standard-iso",
      },
    ],
  },
  {
    id: "benefits",
    title: "Benefit, Rewards, Membership & News",
    apps: [
      {
        id: "benefit",
        title: "Benefit Center",
        description: "Access exclusive employee and member benefits.",
        icon: Gift,
        url: "/apps/benefit",
      },
      {
        id: "rewards",
        title: "Rewards Program",
        description: "Track and redeem your reward points and perks.",
        icon: BadgeCheck,
        url: "/apps/rewards",
        badge: "New",
      },
      {
        id: "membership",
        title: "Membership",
        description: "Manage your membership status and privileges.",
        icon: Users,
        url: "/apps/membership",
      },
      {
        id: "news",
        title: "News",
        description: "Access exclusive news.",
        icon: Gift,
        url: "/apps/benefit",
      },
    ],
  },
  {
    id: "tools",
    title: "Tools & Utilities",
    apps: [
      {
        id: "reminder-surveillance",
        title: "Reminder Surveillance",
        description:
          "Stay on top of upcoming audits and surveillance deadlines with automated reminders.",
        icon: Settings,
        url: "/apps/reminder-surveillance",
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
      <WhatsappButton />
    </div>
  );
};

export default AppsView;
