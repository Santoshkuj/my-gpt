import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
};

const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
})

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [loadingUser, setLoadingUser] = useState<boolean>(false)

  const fetchUser = async () => {
    try {
      setLoadingUser(true)
      const {data} = await axiosInstance.get("/api/user/data");
      if (data.success) {
        setUser(data.user)
      } else {
        setUser(null)
        toast.error(data?.error)
      }
    } catch (error) {
      setUser(null)
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.error)
      }
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setLoadingUser(false)
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast('Login to create a new chat')
        navigate('/')
      await axiosInstance.get('/api/chat/create')
      await fetchUserChats()
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const fetchUserChats = async () => {
    try {
      const {data} = await axiosInstance.get('/api/chat/get')
      if (data.success) {
        setChats(data.chats)
        if (data.chats.length === 0) {
          await createNewChat()
          return fetchUserChats()
        } else {
          setSelectedChat(data.chats[0])
        }
      } else {
        toast.error(data?.error)
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  };

  async function logOut() {
   try {
     const {data} = await axiosInstance.get('/api/user/logout')
     if (data?.success) {
       setUser(null)
     }
   } catch (error) {
    toast.error('Failed to logOut try again')
   }
  }

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value: AppContextType = {
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    createNewChat,
    loadingUser,
    fetchUserChats,
    axiosInstance,
    logOut
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContectProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export default useAppContext;
