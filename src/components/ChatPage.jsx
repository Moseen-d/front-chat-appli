// import { useEffect, useRef, useState } from "react";
// import { MdSend } from "react-icons/md";
// import useChatContext from "../context/ChatContext";
// import { useNavigate } from "react-router";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import toast from "react-hot-toast";
// import { baseURL } from "../config/AxiosHelper";
// import { getMessagess } from "../services/RoomService";
// import { timeAgo } from "../config/helper";
// const ChatPage = () => {
//   const {
//     roomId,
//     currentUser,
//     connected,
//     setConnected,
//     setRoomId,
//     setCurrentUser,
//   } = useChatContext();
//   // console.log(roomId);
//   // console.log(currentUser);
//   // console.log(connected);

//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!connected) {
//       navigate("/");
//     }
//   }, [connected, roomId, currentUser]);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const inputRef = useRef(null);
//   const chatBoxRef = useRef(null);
//   const [stompClient, setStompClient] = useState(null);

//   //page init:
//   //messages ko load karne honge

//   useEffect(() => {
//     async function loadMessages() {
//       try {
//         const messages = await getMessagess(roomId);
//         // console.log(messages);
//         setMessages(messages);
//       } catch (error) {}
//     }
//     if (connected) {
//       loadMessages();
//     }
//   }, []);

//   //scroll down

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scroll({
//         top: chatBoxRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);

//   //stompClient ko init karne honge
//   //subscribe

//   useEffect(() => {
//     const connectWebSocket = () => {
//       ///SockJS
//       const sock = new SockJS(`${baseURL}/chat`);
//       const client = Stomp.over(sock);

//       client.connect({}, () => {
//         setStompClient(client);

//         toast.success("connected");

//         client.subscribe(`/topic/room/${roomId}`, (message) => {
//           console.log(message);

//           const newMessage = JSON.parse(message.body);

//           setMessages((prev) => [...prev, newMessage]);

//           //rest of the work after success receiving the message
//         });
//       });
//     };

//     if (connected) {
//       connectWebSocket();
//     }

//     //stomp client
//   }, [roomId]);

//   //send message handle

//   const sendMessage = async () => {
//     if (stompClient && connected && input.trim()) {
//       console.log(input);

//       const message = {
//         sender: currentUser,
//         content: input,
//         roomId: roomId,
//       };

//       stompClient.send(
//         `/app/sendMessage/${roomId}`,
//         {},
//         JSON.stringify(message)
//       );
//       setInput("");
//     }

//     //
//   };

//   function handleLogout() {
//     stompClient.disconnect();
//     setConnected(false);
//     setRoomId("");
//     setCurrentUser("");
//     navigate("/");
//   }

//   return (
//     <div className="">
//       {/* this is a header */}
//       <header className="dark:border-gray-700  fixed w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">
//         {/* room name container */}
//         <div>
//           <h1 className="text-xl font-semibold">
//             Room : <span>{roomId}</span>
//           </h1>
//         </div>
//         {/* username container */}

//         <div>
//           <h1 className="text-xl font-semibold">
//             User : <span>{currentUser}</span>
//           </h1>
//         </div>
//         {/* button: leave room */}
//         <div>
//           <button
//             onClick={handleLogout}
//             className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"
//           >
//             Leave Room
//           </button>
//         </div>
//       </header>

//       <main
//         ref={chatBoxRef}
//         className="py-20 px-10   w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto "
//       >
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.sender === currentUser ? "justify-end" : "justify-start"
//             } `}
//           >
//             <div
//               className={`my-2 ${
//                 message.sender === currentUser ? "bg-green-800" : "bg-gray-800"
//               } p-2 max-w-xs rounded`}
//             >
//               <div className="flex flex-row gap-2">
//                 <img
//                   className="h-10 w-10"
//                   src={"https://cdn.lazyshop.com/files/9b0d8bde-34c0-460a-b131-e7a87b1e0543/product/f5cbe7810d67ed6d1aa4b3fea0397ef1.jpeg"}
//                   alt=""
//                 />
//                 <div className="flex flex-col gap-1">
//                   <p className="text-sm font-bold">{message.sender}</p>
//                   <p>{message.content}</p>
//                   <p className="text-xs text-gray-400">
//                     {timeAgo(message.timeStamp)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </main>
//       {/* input message container */}
//       <div className=" fixed bottom-4 w-full h-16 ">
//         <div className="h-full  pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
//           <input
//             value={input}
//             onChange={(e) => {
//               setInput(e.target.value);
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 sendMessage();
//               }
//             }}
//             type="text"
//             placeholder="Type your message here..."
//             className=" w-full  dark:border-gray-600 b dark:bg-gray-800  px-5 py-2 rounded-full h-full focus:outline-none  "
//           />

//           <div className="flex gap-1">
//             <button className="dark:bg-purple-600 h-10 w-10  flex   justify-center items-center rounded-full">
//               <MdAttachFile size={20} />
//             </button>
//             <button
//               onClick={sendMessage}
//               className="dark:bg-green-600 h-10 w-10  flex   justify-center items-center rounded-full"
//             >
//               <MdSend size={20} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

// Different profile pictures for different users
const userProfiles = {
  moseen: {
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Moseen",
    color: "bg-blue-900",
  },
  aniket: {
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aniket",
    color: "bg-purple-900",
  },
  "vtu admin": {
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=VtuAdmin",
    color: "bg-amber-900",
  },
};

// Default profile for any other username
const getUserProfile = (username) => {
  return (
    userProfiles[username?.toLowerCase()] || {
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username || "Guest")}`,
      color: "bg-indigo-900",
    }
  );
};

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Load previous messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const previousMessages = await getMessagess(roomId);
        setMessages(previousMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    }

    if (connected && roomId) {
      loadMessages();
    }
  }, [connected, roomId]);

  // Scroll to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Connect WebSocket and subscribe to the room
  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect(
      {},
      () => {
        setStompClient(client);
        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        toast.error("Chat connection failed");
      }
    );

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [connected, roomId]);

  // Send message
  const sendMessage = () => {
    if (stompClient?.connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input.trim(),
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );

      setInput("");
    }
  };

  // Leave room
  function handleLogout() {
    if (stompClient?.connected) {
      stompClient.disconnect();
    }

    setStompClient(null);
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 z-10 w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">
        <h1 className="text-xl font-semibold">
          Room: <span>{roomId}</span>
        </h1>

        <h1 className="text-xl font-semibold">
          User: <span>{currentUser}</span>
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-full text-white"
        >
          Leave Room
        </button>
      </header>

      {/* Messages */}
      <main
        ref={chatBoxRef}
        className="pt-24 pb-28 px-5 md:px-10 w-full md:w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-y-auto"
      >
        {messages.map((message, index) => {
          const isOwnMessage =
            message.sender === currentUser;

          const profile = getUserProfile(message.sender);

          return (
            <div
              key={message.id || `${message.sender}-${index}`}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`my-2 ${
                  isOwnMessage ? "bg-green-800" : profile.color
                } text-white p-3 max-w-xs md:max-w-md rounded-xl shadow-md`}
              >
                <div className="flex gap-3 items-start">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={profile.avatar}
                    alt={`${message.sender}'s profile`}
                  />

                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-bold">
                      {message.sender}

                      {isOwnMessage && (
                        <span className="ml-2 text-xs text-green-300">
                          You
                        </span>
                      )}
                    </p>

                    <p className="break-words">
                      {message.content}
                    </p>

                    <p className="text-xs text-gray-300">
                      {timeAgo(message.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Message input */}
      <div className="fixed bottom-4 w-full h-16">
        <div className="h-full px-3 md:px-5 gap-3 flex items-center justify-between rounded-full w-full md:w-1/2 mx-auto dark:bg-gray-900">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="w-full flex-1 dark:bg-gray-800 px-5 py-2 rounded-full h-full focus:outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-green-600 h-10 w-10 shrink-0 flex justify-center items-center rounded-full text-white hover:bg-green-700 transition-colors"
            title="Send message"
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

