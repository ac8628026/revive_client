import { getXEmbedUrl, getYouTubeEmbedUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { PostType } from "./ContentCard";
import { Twitter, Youtube, Linkedin, Link, FileText } from "lucide-react";
import { GenericPreview } from "./GenericPost";
import { DocumentView } from "./DocumentPost";


type RendererConfig = {
  icon: React.ReactNode;
  color: string;
  render: (link: string) => React.JSX.Element;
};

export const POST_RENDERERS: Record<PostType, RendererConfig> = {
  twitter: {
    icon: <Twitter size={18} />,
    color: "text-blue-500",
    render: (link) => <TwitterPost url={link} />,
  },

  x: {
    icon: <Twitter size={18} />,
    color: "text-blue-500",
    render: (link) => <TwitterPost url={link} />,
  },

  youtube: {
    icon: <Youtube size={18} />,
    color: "text-red-500",
    render: (link) => <YoutubePost url={link} />,
  },

  linkedin: {
    icon: <Linkedin size={18} />,
    color: "text-blue-600",
    render: (link) => <GenericPreview url={link} />,
  },
  document:{
    icon:<FileText size={18}/>,
    color:"",
    render:(link)=><DocumentView url={link}/>
  },
   link:{
    icon:<Link size={18}/>,
    color:"",
    render:(link)=><GenericPreview url={link}/>
  },

  generic: {
    icon: <Link size={18} />,
    color: "text-gray-500",
    render: (link) => <GenericPreview url={link} />,
  },
};

export type LinkType = {
  url: string;
};


export const YoutubePost = ({ url }: LinkType) => {
  const embedUrl = getYouTubeEmbedUrl(url);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100 my-3">
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <div className="w-full aspect-video rounded-md bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="h-12 w-16 bg-gray-300 rounded-lg flex items-center justify-center">
              <div className="h-0 w-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-gray-400"></div>
            </div>
          </div>
        </div>
      )}
      <iframe
        className={`w-full aspect-video h-full transition-opacity ${
          isLoaded ? "opacity-100" : "opacity:0"
        }`}
        src={embedUrl}
        onLoad={() => setIsLoaded(true)}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

declare global {
    interface Window {
        twttr : any;
    }
}

 export const TwitterPost = ({ url }: LinkType) => {
  const embedUrl = getXEmbedUrl(url);

  useEffect(()=>{
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  },[])

  return (
    <blockquote
      style={{ margin: 0 }}
      data-cards="hidden"
      data-conversation="none"
      className=" twitter-tweet  w-full relative"
    >
      <a href={embedUrl}>
        <div className="w-full rounded-md border p-4">
          <div className="flex flex-col animate-pulse space-x-4">
            <div className="flex">
              <div className="size-10 rounded-full bg-gray-200"></div>
              <div className="flex flex-col gap-2 p-1">
                <div className="h-2 rounded bg-gray-200 w-24 "></div>
                <div className="h-2 rounded bg-gray-200 w-24 "></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-3">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                  <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                </div>
                <div className="h-2 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="flex h-24 rounded bg-gray-200 w-full"></div>
            <div className="flex gap-1">
              <div className="h-2 rounded bg-gray-200 w-18 my-1 "></div>
              <div className="h-2 rounded bg-gray-200 w-24 my-1 "></div>
            </div>
          </div>
        </div>
      </a>
    </blockquote>
  );
};
