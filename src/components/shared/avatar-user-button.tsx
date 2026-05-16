import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { logout } from "@/lib/actions/logout";
import Link from "next/link";

interface AvatarUserButtonProps {
    user?: {
        image?: string | null;
        name?: string;
        email?: string;
        id?: string;
        role?: string;
    }
}

export default function AvatarUserButton({ user }: AvatarUserButtonProps) {
    const avatarSrc = user?.image ? user.image : "/default-avatar.png"; // Default image handling

    const mapRoleToDashboard = {
        "ADMINISTRATOR": "/administrator",
        "ADMIN": "/admin",
        "MEDICAL_STAFF": "/medical-staff",
        "CUSTOMER": "/customer"
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`/api/profile/${avatarSrc}`} alt={user?.name || ""} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={`${mapRoleToDashboard[user?.role as keyof typeof mapRoleToDashboard]}/profile`} className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link href={`${mapRoleToDashboard[user?.role as keyof typeof mapRoleToDashboard]}`} className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>
                    <div className="flex items-center cursor-pointer w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
