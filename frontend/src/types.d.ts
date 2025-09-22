import type { AxiosInstance } from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { useNavigate } from "react-router-dom";

export { }

declare global {
    interface AppContextType {
        navigate: ReturnType<typeof useNavigate>;
        user: User | null;
        setUser: Dispatch<SetStateAction<User | null>>;
        fetchUser: () => void;
        chats: Chat[];
        setChats: Dispatch<SetStateAction<Chat[]>>;
        selectedChat: Chat | null;
        setSelectedChat: Dispatch<SetStateAction<Chat | null>>;
        theme: Theme;
        setTheme: Dispatch<SetStateAction<Theme>>;
        createNewChat : () => void;
        loadingUser: boolean;
        fetchUserChats: ()=> void;
        axiosInstance: AxiosInstance;
        logOut: ()=> void
    }

    interface User {
        _id: string;
        name: string;
        email: string;
        password: string;
        credits: number;
    }
    type Theme = 'light' | 'dark';
    type Message = {
        isImage: boolean;
        isPublished?: boolean;
        role: "user" | "assistant";
        content: string;
        timestamp: number;
    };
    interface Chat {
        _id: string;
        userId: string;
        name: string;
        userName: string;
        messages: Message[];
        createdAt: string | Date;
        updatedAt: string | Date;
    }
    type Mode = "image" | "text";

    type Image= {
        userName: string,
        imageUrl: string
    }

    interface Plan {
        _id: string;
        name: string;
        price: number;
        credits: number;
        features: string[]
    }
}