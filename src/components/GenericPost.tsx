import { ExternalLink, Link2 } from "lucide-react";

type GenericPreviewProps = {
  url: string;
};

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "external link";
  }
};

export const GenericPreview = ({ url }: GenericPreviewProps) => {
  const domain = getDomain(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className=" w-full h-full min-h-[140px] flex items-center justify-center rounded-md border border-dashed border-slate-300/60 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors "
    >
      <div className="flex flex-col items-center gap-2 text-center px-4">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Link2 size={18} />
          <span className="text-sm font-medium">{domain}</span>
        </div>

        <div className="text-xs text-slate-400">Open external link</div>

        <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
          <ExternalLink size={14} />
          Open
        </div>
      </div>
    </a>
  );
};
