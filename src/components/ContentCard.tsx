import { ClipboardCheck, Share2, Trash2} from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { deleteContentThunk } from "@/store/slices/contentSlice";
import { POST_RENDERERS } from "./PostType";

export type PostType = "twitter" | "x" | "youtube" | string;

interface ContentCardProps {
  id: string;
  link: string;
  title: string;
  postType: PostType;
  tags?: string[];
  createdAt?: string;
  onDelete?: (id: string) => void;
  onShare?: (link: string) => void;
}

const ContentCard = ({
  id,
  link,
  title,
  postType,
  tags = [],
  createdAt = new Date().toLocaleDateString(),
}: ContentCardProps) => {
  const [isCopy, setisCopy] = useState(false);
  const dispatch = useAppDispatch();

  const normalizePostType = (type?: string): PostType => {
    const t = type?.toLowerCase();

    if (t === "twitter" || t === "x") return "twitter";
    if (t === "youtube") return "youtube";
    if (t === "linkedin") return "linkedin";
    if(t=== "document") return "document";
    if(t==="link") return "link";

    return "generic";
  };

  const normalizedType = normalizePostType(postType);
  const renderer = POST_RENDERERS[normalizedType];


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setisCopy(true);
      setTimeout(() => {
        setisCopy(false);
      }, 300);
    } catch {
      setisCopy(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteContentThunk(id));
  };
  return (
    <div className="flex flex-col w-full justify-center border border-slate-200 dark:border-slate-200/20 bg-white dark:bg-[#121112] dark:text-white/70 text-black shadow-sm hover:shadow-md transition-shadow duration-300 px-4 py-3 rounded-xl">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center  font-medium">
          <span className={renderer.color}>
            {renderer.icon}
          </span>
          <h3 className="text-base truncate max-w-[180px]" title={title}>
            {title}
          </h3>
        </div>

        <div className="flex gap-2 text-slate-400 ">
          <button
            onClick={handleCopy}
            className="hover:text-slate-700 transition-colors p-1"
            aria-label="Share content"
          >
            {" "}
            {isCopy ? <ClipboardCheck size={16} /> : <Share2 size={16} />}
          </button>
          <button
            onClick={handleDelete}
            className="hover:text-red-500 transition-colors p-1"
            aria-label="Delete content"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className=" flex flex-col justify-center items-center py-2">
        {renderer.render(link)}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-auto pt-2">
        Added on {createdAt.split("T0")[0]}
      </p>
    </div>
  );
};

export default ContentCard;
