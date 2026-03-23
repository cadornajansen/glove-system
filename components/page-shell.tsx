"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

type Crumb = {
  label: string;
  href?: string;
};

export function PageShell({
  title,
  status,
  crumbs,
  children,
}: {
  title: string;
  status?: string;
  crumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;

                  return (
                    <React.Fragment key={`${crumb.label}-${index}`}>
                      <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                        {isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href || "#"}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>

                      {!isLast && (
                        <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {status ? <Badge variant="outline">{status}</Badge> : null}
          </div>

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}