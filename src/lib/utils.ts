import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add your domain here
export const rootDomain = process.env.ROOT_DOMAIN || "yourdomain.com";
