"use client";
import { useMediaQuery } from "@/components/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface DrawerDialogDemoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  children: React.ReactNode;
  title?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DrawerDialogDemo({
  open,
  setOpen,
  label,
  children,
  title = true,
  disabled = false,
  className,
}: DrawerDialogDemoProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "bg-yellow-200 hover:bg-yellow-100",
              disabled && "opacity-50 cursor-not-allowed hover:bg-yellow-200",
              className
            )}
            size="sm"
            disabled={disabled}
            onClick={handleTriggerClick}
          >
            <Plus size={20} className="mr-2" />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="lg:max-w-screen-lg overflow-y-auto max-h-screen"
          onInteractOutside={(e) => {
            const hasPacContainer = e.composedPath().some((el: EventTarget) => {
              if ("classList" in el) {
                return Array.from((el as Element).classList).includes(
                  "pac-container"
                );
              }
              return false;
            });

            if (hasPacContainer) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            {title && <DialogTitle>{label}</DialogTitle>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            "bg-primary text-xs p-0 sm:text-sm px-2 sm:px-4",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
          onClick={handleTriggerClick}
        >
          <Plus size={14} />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>New Appointment</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] w-full">{children}</ScrollArea>

        <DrawerFooter className="pt-2"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
