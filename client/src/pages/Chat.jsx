import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";
import api from "../services/api";

const Chat = () => {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Fetch match details ──
  const { data: matchData } = useQuery({
    queryKey: ["acceptedMatches"],
    queryFn: async () => {
      const response = await api.get("/matches/accepted");
      return response.data;
    },
  });

  // ── Debug ──
  console.log('matchId from URL:', matchId);
  console.log('matchData:', matchData);
  console.log('all match IDs:', matchData?.matches?.map(m => m._id));

  // ── Find the other user in this match ──
  const currentMatch = matchData?.matches?.find((m) => m._id.toString() === matchId.toString());
  console.log('currentMatch:', currentMatch);
  console.log('otherUser:', currentMatch ? (currentMatch.userA?._id === user?._id ? currentMatch.userB : currentMatch.userA) : null);
  const otherUser = currentMatch
    ? currentMatch.userA?._id === user?._id
      ? currentMatch.userB
      : currentMatch.userA
    : null;

  // ── Fetch message history ──
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${matchId}`);
        setMessages(response.data.messages);
        // Mark as read
        await api.patch(`/messages/${matchId}/read`);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [matchId]);

  // ── Socket events ──
  useEffect(() => {
    if (!socket) return;

    // Join this match's room
    socket.emit("join:match", matchId);

    // Receive new messages
    socket.on("receive:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Typing indicator
    socket.on("typing:indicator", ({ name, isTyping }) => {
      if (isTyping) {
        setTypingUser(name);
      } else {
        setTypingUser("");
      }
    });

    return () => {
      socket.emit("leave:match", matchId);
      socket.off("receive:message");
      socket.off("typing:indicator");
    };
  }, [socket, matchId]);

  // ── Auto scroll to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──
  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    socket.emit("send:message", {
      matchId,
      content: input.trim(),
      type: "text",
    });

    setInput("");

    // Stop typing indicator
    socket.emit("typing:stop", matchId);
    clearTimeout(typingTimeoutRef.current);
  };

  // ── Typing indicator logic ──
  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!socket) return;

    // Emit typing start
    socket.emit("typing:start", matchId);

    // Stop typing after 2 seconds of inactivity
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", matchId);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/matches")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              {otherUser?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {otherUser?.name || "Loading..."}
              </p>
              <p className="text-xs text-gray-400">
                {currentMatch?.matchScore}% match
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">
                You matched with {otherUser?.name}!
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Say hello and schedule a mock interview 👋
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isOwn =
              message.sender?._id === user?._id || message.sender === user?._id;
            return (
              <MessageBubble
                key={message._id || index}
                message={message}
                isOwn={isOwn}
              />
            );
          })}

          {/* Typing indicator */}
          {typingUser && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                {typingUser.charAt(0)}
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5">
                <div className="flex gap-1 items-center h-4">
                  <span
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Message bubble ──
const MessageBubble = ({ message, isOwn }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
          {message.sender?.name?.charAt(0).toUpperCase() || "?"}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isOwn
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>
        <span className="text-xs text-gray-400 px-1">{time}</span>
      </div>
    </div>
  );
};

export default Chat;
