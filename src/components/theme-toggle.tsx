"use client";

import * as React from "react";
import { Moon, Sun, Computer } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-1 justify-center">
      <Button variant="ghost" size="icon" onClick={() => setTheme("system")}>
        <Computer />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
        <Sun />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
        <Moon />
      </Button>
    </div>
  );
}
