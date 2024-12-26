"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 ">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[9150]">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {theme.slice(0, 1).toUpperCase() + theme.slice(1, theme.length)}
          </DropdownMenuItem>
        ))}

        {/*<DropdownMenuItem onClick={() => setTheme("light")}>*/}
        {/*    Light*/}
        {/*</DropdownMenuItem>*/}
        {/*<DropdownMenuItem onClick={() => setTheme("dark")}>*/}
        {/*    Dark*/}
        {/*</DropdownMenuItem>*/}
        {/*<DropdownMenuItem onClick={() => setTheme("system")}>*/}
        {/*    System*/}
        {/*</DropdownMenuItem>*/}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
