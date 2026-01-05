import { Youtube, X, Link2, FileText, BrainCircuit, MessageCircleCode } from "lucide-react";

import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { logout, userThunk } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function AppSidebar() {
  const { state,toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"
  const dispatch = useAppDispatch();
  const { isAuthenticated,userDetails } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated]);

const dispatchdata =async()=>{
   await dispatch(userThunk())
   console.log(userDetails);
}
  useEffect(()=>{
    dispatchdata()
  },[])

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className={`flex ${!isCollapsed?"p-1":"p-0"} flex-row justify-between items-center`}>
            <div onClick={()=>toggleSidebar()} className={`flex flex-row items-center ${!isCollapsed?"":"cursor-w-resize"} `}>
               <BrainCircuit size={24} color="#7876e5" />
           {!isCollapsed && <span className="text-xl pl-2  ">
               Revive
            </span>}
            </div>
            {!isCollapsed &&<SidebarTrigger />}
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu className="py-4 ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex px-3 w-full">
        {!isCollapsed && <Button onClick={handleLogout}>Logout</Button>}
       {!isCollapsed && <ModeToggle />}
      </SidebarFooter>
    </Sidebar>
  );
}


const items = [
  {
    title: "All Thoughts",
    url: "/",
    icon: BrainCircuit,
  },
  {
    title: "Tweets",
    url: "/x",
    icon: X,
  },
  {
    title: "Videos",
    url: "/youtube",
    icon: Youtube,
  },
  {
    title: "Documents",
    url: "/document",
    icon: FileText,
  },
  {
    title: "Links",
    url: "/links",
    icon: Link2,
  },
  {
    title: "Chat With Your Brain",
    url: "/chat",
    icon: MessageCircleCode,
  },
];
