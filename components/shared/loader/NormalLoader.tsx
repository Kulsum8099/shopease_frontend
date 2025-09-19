import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
};

export default function NormalLoader({ className }: Props) {
  return (
    <div
      className={cn("h-[100px] flex justify-center items-center", className)}
    >
      <Loader className="animate-spin text-brandColor" size={40} />
    </div>
  );
}
