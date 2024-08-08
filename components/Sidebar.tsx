"use client";

import { cn } from "@/lib/utils";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Plus,
  Home,
  BookText,
  Search,
  User,
  RocketIcon,
  Contact,
  Users2,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  isMobile: boolean;
}

export const Sidebar = ({ isMobile }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const onNavigate = (url: string) => {
    return router.push(url);
  };

  const routes = [
    {
      icon: Search,
      href: "/",
      label: "Discover",
    },
    {
      icon: Home,
      href: "/models",
      label: "My Models",
    },
    {
      icon: Plus,
      href: "/character/new",
      label: "Create",
    },
    {
      icon: User,
      href: "/profile",
      label: "Profile",
    },
    {
      icon: Settings,
      href: "/settings",
      label: "Settings",
    },
    {
      icon: RocketIcon,
      href: "https://launchpad.vectorchat.ai",
      label: "Launchpad",
    },
  ];

  const bot_routes = [
    {
      icon: Users2,
      href: "https://t.me/vectorchatai",
      label: "Join Community",
    },
    {
      icon: QuestionMarkCircledIcon,
      href: "mailto:team@vectorchat.ai",
      label: "Get Help",
    },
    {
      icon: BookText,
      href: "https://docs.vectorchat.ai",
      label: "Docs",
    },
  ];

  return !isMobile ? (
    <div className="flex h-full flex-col space-y-4 bg-white text-primary">
      <div className="justify-begin flex h-full p-3">
        <div className="flex h-full w-full flex-col justify-between space-y-2">
          <div>
            {routes.map((route) => (
              <div
                onClick={() => onNavigate(route.href)}
                key={route.href}
                className={cn(
                  "group flex w-full cursor-pointer rounded-lg p-3 text-[0.8rem] font-medium text-muted-foreground/70 transition hover:bg-primary/5",
                  pathname == route.href && "bg-primary/10 text-primary",
                )}
              >
                <div className="flex flex-1 items-center gap-x-3">
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </div>
              </div>
            ))}
          </div>
          <div className="pb-2">
            {bot_routes.map((route) => (
              <div
                onClick={() => onNavigate(route.href)}
                key={route.href}
                className={cn(
                  "group flex w-full cursor-pointer rounded-lg p-3 text-[0.8rem] font-medium text-muted-foreground/70 transition hover:bg-primary/5",
                  pathname == route.href && "bg-primary/10 text-primary",
                )}
              >
                <div className="flex flex-1 items-center gap-x-3">
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col space-y-4 text-primary">
      <div className="flex flex-1 justify-center p-3">
        <div className="space-y-2">
          {routes.map((route) => (
            <div
              onClick={() => onNavigate(route.href)}
              key={route.href}
              className={cn(
                "group flex w-full cursor-pointer justify-start rounded-lg p-3 text-xs font-medium text-muted-foreground/70 transition hover:text-blue-600",
                pathname == route.href && "text-primary",
              )}
            >
              <div className="flex flex-1 flex-col items-center gap-y-2">
                <route.icon className="h-5 w-5" />
                {route.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
