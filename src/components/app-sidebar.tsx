import { Youtube, X, Link2, FileText, BrainCircuit, MessageCircleCode, Sun, Moon, MonitorCog, Sparkles } from "lucide-react";

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
} from "@/components/ui/sidebar";
import { logout, userThunk } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';


export function AppSidebar() {
  const { state,toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"
  const dispatch = useAppDispatch();
  const { isAuthenticated,userDetails } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const { setTheme,theme } = useTheme()

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
       
       {!isCollapsed && 
       <div className="flex gap-2 justify-around ">
        <Button className={`${theme==='light'?"flex-2":"flex-1"}`} variant={`${theme==='light'?"default":"outline"}`} onClick={() => setTheme("light")}>
          <Sun className="h-[1.2rem] w-[1.2rem]  rotate-0 transition-all dark:-rotate-90" />
        </Button>
        <Button className={`${theme==='dark'?"flex-2":"flex-1"}`} variant={`${theme==='dark'?"default":"outline"}`} onClick={() => setTheme("dark")}>
          <Moon className="h-[1.2rem] w-[1.2rem]  " />
        </Button>
        <Button className={`${theme==='system'?"flex-2 ":"flex-1"}`} variant={`${theme==='system'?"default":"outline"}`} onClick={() => setTheme("system")}>
          <MonitorCog className="h-[1.2rem] w-[1.2rem]  " />
        </Button>
       </div>}
      {!isCollapsed && <Button onClick={handleLogout}>Logout</Button>}
      </SidebarFooter>
       <div  className="border-t flex justify-between px-4 py-2">
         <div>{userDetails?.name}</div>
         <div className="px-3 py-1 border rounded-full uppercase">{userDetails?.name.slice(0,1) || 'U'}</div>
       </div>
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
    title: "Pdf and Documents",
    url: "/document",
    icon: FileText,
  },
  {
    title: "Links",
    url: "/links",
    icon: Link2,
  },
  {
    title: `Chat With Your Brain ✨`,
    url: "/chat",
    icon: MessageCircleCode,
  },
];
