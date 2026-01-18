import { Button } from "@/components/ui/button";
import { BrainCircuit, Copy, PanelLeft, Plus, Share2 } from "lucide-react";
import ContentCard from "../components/ContentCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createContentThunk,
  getContentThunk,
  getShareStatusThunk,
  updateShareThunk,
} from "@/store/slices/contentSlice";
import { useParams } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

type AddContentDialogProps = {
  setOpenAddContent: React.Dispatch<React.SetStateAction<boolean>>;
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useSidebar();

  const { type } = useParams<{ type?: string }>();
  const { contents, fetchError, fetching } = useAppSelector((s) => s.content);
  const allContents = type ? contents.filter((c) => c.type === type) : contents;

  const [openAddContent, setOpenAddContent] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const fetchContent = async () => {
    await dispatch(getContentThunk());
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleShareBrain = async () => {
    await dispatch(getShareStatusThunk());
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-center "> **The server may take a few minutes to warm up.**</div>
      <PanelLeft onClick={toggleSidebar} size={28} className="pt-1 pl-2" />
      <div className="p-4 md:p-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Thoughts</h1>
          <div className="flex gap-2">
            <Dialog open={openShare} onOpenChange={setOpenShare}>
              <DialogTrigger asChild>
                <Button variant="brand" onClick={handleShareBrain}>
                  <Share2 />
                  <span className="hidden sm:block">Share Brain </span>
                </Button>
              </DialogTrigger>
              <ShareDilog />
            </Dialog>
            <Dialog open={openAddContent} onOpenChange={setOpenAddContent}>
              <DialogTrigger asChild>
                <Button variant="brand2">
                  <Plus /> <span className="hidden sm:block">Add Thought </span>
                </Button>
              </DialogTrigger>
              <AddContentDilog setOpenAddContent={setOpenAddContent} />
            </Dialog>
          </div>
        </div>
        {fetchError ? (
          <div className="p-10"> {fetchError}</div>
        ) : fetching ? (
          <div className="flex justify-center pt-10 ">
            <BrainCircuit className="brain-loader" strokeWidth={2} size={32} />
          </div>
        ) : allContents.length === 0 ? (
          <div className="p-4">No Thoughts Found</div>
        ) : (
          <div className="grid p-6 gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {allContents &&
              allContents.map((item) => {
                return (
                  <ContentCard
                    tags={item.tags}
                    createdAt={item.createdAt}
                    link={item.link}
                    title={item.title}
                    postType={item.type}
                    key={item._id}
                    id={item._id}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

const AddContentDilog = ({ setOpenAddContent }: AddContentDialogProps) => {
  const { creating } = useAppSelector((s) => s.content);
  const dispatch = useAppDispatch();
  const [contentData, setContentData] = useState({
    link: "",
    title: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContentData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const addContent = async () => {
    await dispatch(createContentThunk(contentData)).unwrap();
  };

  const handleSubmit = async () => {
    try {
      await addContent();
      setContentData({ link: "", title: "", type: "" });
      setOpenAddContent(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Content</DialogTitle>
        <DialogDescription>
          Your Another Brain is waiting for next thought.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            onChange={handleChange}
            value={contentData.title}
            name="title"
            placeholder="React hooks"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            name="link"
            value={contentData.link}
            onChange={handleChange}
            placeholder="https://www.youtube.com/"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="type">Type</Label>
          <Select
            value={contentData.type}
            onValueChange={(value) =>
              setContentData((data) => ({ ...data, type: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type of Thought" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="youtube">Youtube</SelectItem>
                <SelectItem value="x">X</SelectItem>
                <SelectItem value="links">Links</SelectItem>
                {/* <SelectItem value="document">Document</SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSubmit}>
          {" "}
          {creating ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const ShareDilog = () => {
  const { shareData, getsharing, shareError } = useAppSelector(
    (s) => s.content
  );
  const dispatch = useAppDispatch();

  const handleSwitch = async () => {
    if (shareData.shared) {
      await dispatch(updateShareThunk({ isShare: false }));
    } else {
      await dispatch(updateShareThunk({ isShare: true }));
    }
  };
  const brainShareLink: string = `${
    import.meta.env.VITE_FRONTEND_BASE_URL
  }/brain/share/${shareData.shareId}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(brainShareLink);
  };
  if (shareError) {
    return <div>{shareError}</div>;
  }
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex justify-between pr-6 md:pr-12">
          Enable Sharing{" "}
          <Switch
            id="sharing"
            checked={shareData.shared}
            onCheckedChange={handleSwitch}
          />
        </DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to access this Brain.
        </DialogDescription>
      </DialogHeader>
      {getsharing ? (
        <div className="flex justify-center w-full">
          <BrainCircuit className="brain-loader" strokeWidth={2}/>
        </div>
      ) : (
        shareData.shared && (
          <>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input id="link" defaultValue={brainShareLink} readOnly />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleCopy} variant="outline">
                <Copy /> Copy
              </Button>
            </DialogFooter>
          </>
        )
      )}
    </DialogContent>
  );
};
