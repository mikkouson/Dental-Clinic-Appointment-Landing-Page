// branchRadio.tsx

"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl } from "../ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

// Inline type definition for Branch (only necessary fields)
interface Branch {
  id: number;
  name: string;
  preferred?: boolean;
}

type FieldProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur: () => void;
};

interface RadioBtnProps {
  data: readonly Branch[]; // Now includes 'preferred' flag
  field: FieldProps;
  form?: UseFormReturn<any>; // Make form optional
  timeclear?: boolean; // Keep timeclear optional
  num?: boolean; // Allow `num` to control type
  text?: boolean; // Optional prop to control display of search input
}

export function RadioBtn({
  data,
  field,
  form,
  timeclear = false,
  num = false,
  text = false,
}: RadioBtnProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSetData = (id: string | number) => {
    field.onChange(id);
    setOpen(false);
    if (timeclear && form) {
      form.setValue("time", 0);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearchQuery(""); // Clear search query when closing
    }
    setOpen(isOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? data.find((item) => item.id === field.value)?.name
              : "Select branch"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 popover-content-width-same-as-its-trigger">
        <Command>
          {text && ( // Conditionally render search input based on `text` prop
            <CommandInput
              placeholder="Search branch..."
              onValueChange={(value) => setSearchQuery(value.toString())}
            />
          )}
          <CommandList>
            <CommandEmpty>No branch found.</CommandEmpty>
            <ScrollArea
              className={"[&>[data-radix-scroll-area-viewport]]:max-h-[300px]"}
            >
              <CommandGroup>
                {filtered.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSetData(item.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.id === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                    {item.preferred && (
                      <span className="ml-2 text-green-600 text-sm">
                        (Preferred)
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
