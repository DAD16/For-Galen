"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/learn": "Training Hub",
  "/ask": "Ask Claude",
  "/projects": "Projects",
  "/progress": "Progress",
  "/settings": "Settings",
  "/my-courses": "My Courses",
  "/my-courses/new": "New Course",
  "/skills": "Skills",
  "/skills/tutor": "Skill Tutor",
  "/skills/coach": "Project Coach",
  "/instructors": "Instructors",
};

export function SiteHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  // For instructor profile pages, format the name nicely
  const getPageTitle = () => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    if (segments[0] === "instructors" && segments[1]) {
      return segments[1]
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return (
      segments[segments.length - 1]?.replace(/-/g, " ") || "Dashboard"
    );
  };
  const pageTitle = getPageTitle();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="mx-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">For Galen</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.length > 0 && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {pageTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
