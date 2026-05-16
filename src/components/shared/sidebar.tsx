"use client";

import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Logo from "./logo";
import { menuLinks } from "@/lib/menu-links";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const session = useSession();
    
    // Determine user role from pathname
    let role = "customer"; // default role
    if (pathname.startsWith("/administrator")) {
        role = "administrator";
    } else if (pathname.startsWith("/admin")) {
        role = "admin";
    } else if (pathname.startsWith("/medical-staff")) {
        role = "medical-staff";
    } else if (pathname.startsWith("/customer")) {
        role = "customer";
    }

    const menuItems = menuLinks[role] || [];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen">
            <div className={cn(
                "flex h-full flex-col bg-background",
                "w-14 md:w-56 p-2",
                "border-r"
            )}>
                <div className="flex items-center justify-center md:justify-start px-3 py-4 mb-4">
                    <div className="md:hidden text-lg font-bold">MD</div>
                    <div className="hidden md:block">
                        <Logo />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 flex-grow">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || 
                            (pathname.startsWith(item.href) && item.href !== `/${role}`) ||
                            (pathname === `/${role}` && item.href === `/${role}`);
                        return (
                            <TooltipProvider key={item.href} delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-4 px-3 py-2 rounded-lg transition-colors",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="hidden md:inline-flex text-sm font-medium">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="md:hidden">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    signOut();
                                }}
                                className="flex items-center gap-4 px-3 py-2 rounded-lg w-full mt-auto"
                            >
                                <div className="flex items-center gap-2">
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden md:inline-flex text-sm font-medium">
                                        Logout
                                    </span>
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="md:hidden">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </aside>
    );
}
