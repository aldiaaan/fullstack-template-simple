import React from "react";
import { NavLink, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

export type DashboardSectionHeaderProps = {
  title?: React.ReactNode;
  tabs?: {
    href: string;
    key: string;
    label?: React.ReactNode;
  }[];
  renderActions?: () => React.ReactNode;
  actions?: React.ElementType;
};

export function DashboardSectionHeader(props: DashboardSectionHeaderProps) {
  const { title, actions = React.Fragment, tabs = [], renderActions } = props;

  const Actions = actions;

  return (
    <header className="items-center gap-2 border-b transition-[width,height] ease-linear ">
      <div className="flex h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium truncate mr-4">{title}</h1>
        <div className="ml-auto">
          {renderActions ? renderActions() : <Actions />}
        </div>
      </div>
      {tabs.length ? (
        <div className="flex gap-4 px-6 h-10 mt-2">
          {tabs.map((tab) => (
            <NavLink
              viewTransition
              className="flex aria-[current=page]:border-foreground aria-[current=page]:text-foreground transition-colors text-muted-foreground/80 items-center text-sm font-medium tracking-tight"
              to={tab.href}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </header>
  );
}
