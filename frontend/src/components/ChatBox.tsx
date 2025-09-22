import { assets } from "assets/assets";
import useAppContext from "context/AppContext";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const ChatBox = () => {
  const { selectedChat, theme, user, axiosInstance, setUser } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [mode, setMode] = useState<Mode>("text");
  const [isPublished, setPublished] = useState<boolean>(false);
  const containerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (!user) return toast.error("Login to send message");
      setLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);
      setPrompt("");

      const { data } = await axiosInstance.post(`/api/message/${mode}`, {
        chatId: selectedChat?._id,
        prompt,
        isPublished,
      });
      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);
        if (mode === "image") {
          setUser((prev) => ({ ...prev!, credits: (prev?.credits ?? 0) - 2 }));
        } else {
          setUser((prev) => ({ ...prev!, credits: (prev?.credits ?? 0) - 1 }));
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.error);
      }
    } finally {
      setPrompt('')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-20 max-md:mt-14 2xl:pr-40">
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center gap-2">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className="mt-5 text-4xl sm:text-white"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}
        {messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce" />
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm  mx-auto">
          <p className="text-xs">Publish Generates Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </label>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80869F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value as Mode)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option value="text" className="dark:bg-purple-900">
            Text
          </option>
          <option value="image" className="dark:bg-purple-900">
            Image
          </option>
        </select>
        <input
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none"
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button disabled={loading} type="submit">
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="send"
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};
export default ChatBox;
