"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Label } from "./label";

type SelectableComboboxProps = {
  options: Array<{ id: string; name: string }>;
  value?: string;
  onChange: (value: string) => void;
  onCreateNew?: (name: string) => Promise<string | void>;
  placeholder?: string;
  label?: string;
  emptyText?: string;
  createText?: string;
};

export function SelectableCombobox({
  options,
  value,
  onChange,
  onCreateNew,
  placeholder = "Select option...",
  label,
  emptyText = "No options found.",
  createText = "Create",
}: SelectableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOption = options.find((opt) => opt.id === value);
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const showCreateOption =
    onCreateNew &&
    searchValue.trim() &&
    !options.some(
      (opt) => opt.name.toLowerCase() === searchValue.toLowerCase()
    );

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreateNew = async () => {
    if (!onCreateNew || !searchValue.trim()) return;
    try {
      const newId = await onCreateNew(searchValue.trim());
      if (newId) {
        onChange(newId);
      }
      setOpen(false);
      setSearchValue("");
    } catch (error) {
      console.error("Failed to create new option:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showCreateOption) {
      e.preventDefault();
      handleCreateNew();
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              placeholder="Search..."
              value={searchValue}
              onValueChange={setSearchValue}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              {filteredOptions.length === 0 && !showCreateOption && (
                <CommandEmpty>{emptyText}</CommandEmpty>
              )}
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <CheckIcon
                      className={`mr-2 h-4 w-4 ${
                        value === option.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {option.name}
                  </CommandItem>
                ))}
                {showCreateOption && (
                  <CommandItem
                    value={`create-${searchValue}`}
                    onSelect={handleCreateNew}
                    className="text-primary"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {createText} "{searchValue}"
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

