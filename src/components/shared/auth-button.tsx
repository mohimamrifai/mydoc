"use client";

import { Button } from "../ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AuthButton() {
  return (
    <div className="flex gap-4">
      <Link href="/login">
        <Button variant="default" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Signup
        </Button>
      </Link>
    </div>
  );
}
