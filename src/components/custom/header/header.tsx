"use client";
import AppLogo from "../icons/app-icon";
import HeaderRight from "./header-right";
import StickyHeader from "./sticky-header";
import Link from "next/link";
export default function Header() {
  return (
    <StickyHeader offset={0} className="py-1 border-b h-16">
      <div className="flex w-full max-w-2xl items-center ">
        <div className="w-[165px] inline-block">
          <Link href={"/"} aria-label="Application Logo" className="w-[165px] ">
            <AppLogo className="max-w-[155px] text-orange-700" />
          </Link>
        </div>
      </div>
      <HeaderRight />
    </StickyHeader>
  );
}
