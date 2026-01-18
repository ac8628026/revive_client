import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  BrainCircuit,
  Loader2,
  PanelLeft,
  MessageSquareText,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { chatService, type Chat, type Message } from "@/services/chatService";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleSidebar } = useSidebar();

  const navigate = useNavigate();
  const { chatId } = useParams();
  const userDetails = useAppSelector((s) => s.auth.userDetails);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const fetchHistory = async () => {
      setMessageLoading(true);
      try {
        const data = await chatService.getChatHistory(chatId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setMessageLoading(false);
      }
    };
    fetchHistory();
  }, [chatId]);

  useEffect(() => {
    const fetchChats = async () => {
      setChatsLoading(true);
      try {
        const data = await chatService.getAllChats();
        setChats(data);
        setChatsLoading(false);
      } catch (error) {
        console.error("Failed to load chats", error);
        setChatsLoading(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleNewChat = () => {
    navigate("/chat");
    setInputValue("");
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userText = inputValue;
    setInputValue("");
    setIsLoading(true);

    const tempUserMsg: Message = {
      _id: Date.now().toString(),
      role: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      let currentChatId = chatId;

      if (!currentChatId) {
        const createRes = await chatService.createChat();
        currentChatId = createRes.chatId;

        navigate(`/chat/${currentChatId}`);

        setChats((prev) => [
          { chatId: currentChatId!, title: "New Chat" },
          ...prev,
        ]);
      }

      const data = await chatService.sendMessage(currentChatId, userText);

      const aiMsg: Message = {
        _id: data._id,
        role: "assistant",
        content: data.content,
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (data.newTitle) {
        setChats((prev) =>
          prev.map((c) =>
            c.chatId === currentChatId ? { ...c, title: data.newTitle! } : c
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <aside
        className={`
        fixed md:relative z-20 h-full w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }
      `}
      >
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 w-full px-4 py-2 bg-sidebar-primary/40 text-sidebar-primary-foreground hover:opacity-90 rounded-md text-sm font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider mt-2">
            All Conversation
          </div>
          {chatsLoading ? (
            <div className="flex items-center justify-center pt-20">
              <BrainCircuit className="brain-loader" strokeWidth={2} />
            </div>
          ) : (
            <>
              {chats.map((chat) => (
                <button
                  key={chat.chatId}
                  onClick={() => {
                    setMessages([]);
                    navigate(`/chat/${chat.chatId}`);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                    chatId === chat.chatId
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col h-full relative bg-background">
        <div className="md:hidden p-4 border-b border-border flex items-center justify-between bg-background">
          <PanelLeft onClick={toggleSidebar} size={28} className="pt-3 pl-2" />
          <Button variant="outline" onClick={() => setIsSidebarOpen(true)}>
            <MessageSquareText className="w-5 h-5" />
            All Chats
          </Button>
        </div>

        {!chatId && messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <BrainCircuit className="brain-loader strokeWidth={2} w-8 h-8 text-foreground" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                what's in your mind?
              </h2>
            </div>

            <div className="w-full max-w-2xl">
              <div className="relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="w-full p-4 pr-12 rounded-2xl border border-input bg-card shadow-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : messageLoading ? (
          <div className="flex items-center justify-center h-full">
            <BrainCircuit className="brain-loader" strokeWidth={2} size={32} />
          </div>
        ) : (
          <>
            <header className="h-10 md:h-14 border-b border-border flex items-center px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 justify-between">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                {chats.find((c) => c.chatId === chatId)?.title || "New Chat"}
              </h2>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex gap-4 max-w-3xl mx-auto ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                      <BrainCircuit className="w-5 h-5 text-secondary-foreground" />
                    </div>
                  )}

                  <div
                    className={`px-5 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/70 text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-card-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                      <div className="uppercase">
                        {userDetails?.name.slice(0, 1) || "U"}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 max-w-3xl mx-auto justify-start">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                    <BrainCircuit className="brain-loader w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-card border border-border rounded-bl-sm flex items-center gap-2">
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-background border-t border-border">
              <div className="max-w-3xl mx-auto relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Message..."
                  disabled={isLoading}
                  className="w-full p-3 pr-12 rounded-xl border border-input bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
