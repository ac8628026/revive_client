import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getYouTubeEmbedUrl = (url: string): string => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : 'null';
};

export const getXEmbedUrl = (url: string): string  => {
  const regex = /\/status\/(\d+)/;
  const match = url.match(regex);
  return match ? `https://twitter.com/reactjs/status/${match[1]}`: "null";
};