
type DocumentViewProps = {
  url: string;
};

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "document";
  }
};


export const DocumentView = ({ url }: DocumentViewProps) => {
 const domain = getDomain(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className=" min-h-[120px] w-full flex items-center justify-center rounded-md border border-dashed bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition " >
      <div className="flex flex-col items-center gap-2 text-center px-4">
        <span className="text-sm font-medium">{domain}</span>
        <span className="text-xs text-slate-400">
          Open document
        </span>
      </div>
    </a>
  );
};
