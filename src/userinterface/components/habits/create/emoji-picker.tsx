"use client";

import { useState } from "react";
import { Button } from "@/userinterface/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/userinterface/components/ui/popover";
import { EMOJIS } from "./emojis";

interface EmojiPickerProps {
  defaultEmoji?: string;
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({
  defaultEmoji = "✨",
  onEmojiSelect,
}: EmojiPickerProps) {
  const [selectedEmoji, setSelectedEmoji] = useState(defaultEmoji);
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-10 rounded-full p-0 text-lg"
        >
          {selectedEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              className="h-8 w-8 p-0 text-lg"
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
