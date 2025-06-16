"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EMOJIS } from "./emojis";

interface EmojiPickerProps {
  defaultEmoji?: string;
  onEmojiSelect?: (emoji: string) => void;
}

export function EmojiPicker({
  defaultEmoji = "✨",
  onEmojiSelect,
}: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-9 h-9 text-xl p-0"
          aria-label="Sélectionner un emoji"
        >
          {defaultEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Choisissez un emoji</p>
          <div className="grid grid-cols-6 gap-2">
            {EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                className="h-9 w-9 p-0 text-lg"
                onClick={() => onEmojiSelect?.(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
