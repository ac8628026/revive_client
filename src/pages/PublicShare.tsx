import { Button } from "@/components/ui/button";
import ContentCard from "../components/ContentCard";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getShareThunk } from "@/store/slices/contentSlice";
import { Link, useParams } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

const PublicShare = () => {
  const dispatch = useAppDispatch();
  const { contents, fetchError } = useAppSelector((s) => s.content);
  const param = useParams();
  const brainId = param.id ?? "";
  const fetchContent = async () => {
    await dispatch(getShareThunk(brainId));
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen w-full ">
      <div className="p-3 md:p-6">
        <Link to="/">
          <span className="flex items-center text-xl gap-2 ">
            <BrainCircuit color="#7876e5" />
            Revive
          </span>
        </Link>
      </div>

      <div className="px-6 md:px-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Thoughts</h1>
          <Link to="/signin">
            <Button> Create Brain</Button>
          </Link>
        </div>
        {fetchError ? (
          <div className="flex flex-col p-6 gap-3">
             <div>
                {fetchError}
            </div> 
            <Link to='/signin' className="link underline">
               Create you own Brain
            </Link>
          
          </div>
        ) : (
          <div className="grid p-6 gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {contents &&
              contents.map((item) => {
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

export default PublicShare;
