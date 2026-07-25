"use client";

import { Sparkles } from "lucide-react";

import { NavList } from "@/components/layout/AppNav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type MobileNavDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MobileNavDrawer({
  open,
  onOpenChange,
}: MobileNavDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-72 border-slate-800 bg-[#071426] text-white"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-base font-bold leading-tight">
                LeadFlow AI
              </p>
              <p className="text-xs font-normal text-slate-400">
                Inteligência comercial
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4">
          <NavList onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
