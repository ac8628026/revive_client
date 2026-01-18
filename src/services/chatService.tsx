import api from "@/services/axios";

export interface Chat {
  chatId: string;
  title: string;
}

export interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface SendMessageResponse {
  _id: string;
  content: string;
  role: "assistant";
  chatId: string;
  newTitle?: string | null;
}

export interface CreateChatResponse {
  chatId: string;
  message: string;
}


export const chatService = {

  getAllChats: async (): Promise<Chat[]> => {
    const { data } = await api.get<Chat[]>("/chat/all-chats");
    return data;
  },


  getChatHistory: async (chatId: string): Promise<Message[]> => {
    const { data } = await api.get<Message[]>(`/chat/conversations/${chatId}`);
    return data;
  },

  createChat: async (): Promise<CreateChatResponse> => {
    const { data } = await api.get<CreateChatResponse>("/chat/create");
    return data;
  },

  
  sendMessage: async (chatId: string, message: string): Promise<SendMessageResponse> => {
    const { data } = await api.post<SendMessageResponse>("/chat/message", {
      query: message, 
      chatId: chatId,
    });
    return data;
  },
};