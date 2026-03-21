import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanMarkdownResponse = (md: string) => {
  if (md.startsWith("```markdown")) {
    return md.replace(/^```markdown\s*/, "").replace(/\s*```$/, "");
  }

  return md;
};