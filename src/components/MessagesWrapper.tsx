import { fetchMessages, Message } from "@/api/message";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, CheckCheck, Clock4 } from "lucide-react";
import moment from "moment";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  RefObject,
  Fragment,
} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useSocket } from "./SocketProvider";
import { useInView } from "react-intersection-observer";
import PopAlertSound from "@/assets/pop-alert.mp3";
import { groupBy } from "@/utils/groupBy";
import { roomsContext } from "./RoomsContext";
import MessageInputBar from "./MessageInputBar";

const MessagesWrapper = ({ roomId }: { roomId: string }) => {
  const { isLoading, data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", roomId],
      queryFn: ({ pageParam }) => fetchMessages({ pageParam, roomId }),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return lastPage.length && allPages.length + 1;
      },
    });
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();
  const { inView, ref } = useInView();
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useContext(AuthContext);
  const messagesGroupedByDays = groupBy<string, Message>(
    messages,
    (message: Message) => moment(message.createdAt).format("DD-MM-YYYY")
  );

  const addMessage = (message: Message) => {
    setMessages((messages) => {
      if (messages.find((msg) => msg.id === message.id)) {
        return messages;
      }
      queryClient.invalidateQueries(["messages", "last", roomId]);
      return [message, ...messages];
    });
    if (message.sender.id === user.id) {
      messagesWrapperRef.current?.scrollTo({ top: 0 });
    }
  };

  useEffect(() => {
    if (data) {
      setMessages(data.pages.flat());
    }
  }, [data]);

  useEffect(() => {
    socket?.on("message", (message: Message) => {
      if (message.roomId === roomId) {
        addMessage(message);
        new Audio(PopAlertSound).play();
      }
    });
  }, []);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <div className="table-cell align-bottom h-full max-h-[65vh] translate-z-0">
        <div
          className="max-h-full h-full overflow-auto flex flex-col-reverse gap-8 justify-start px-4"
          ref={messagesWrapperRef}
        >
          <ScrollDownButton containerRef={messagesWrapperRef} />
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            Array.from(messagesGroupedByDays).map(
              ([messagesDate, messages]) => (
                <Fragment key={messagesDate}>
                  {messages.map((message) => (
                    <MessageCard message={message} key={message.id} />
                  ))}
                  <span className="w-fit rounded-3xl bg-slate-600 text-white mx-auto py-1 px-4">
                    {messagesDate}
                  </span>
                </Fragment>
              )
            )
          )}
          {hasNextPage && (
            <button
              className={`btn btn-primary ${
                isFetchingNextPage && "btn-disabled"
              }`}
              ref={ref}
              onClick={() => fetchNextPage()}
            >
              Load more
            </button>
          )}
        </div>
      </div>
      <MessageInputBar
        roomId={roomId}
        addMessage={addMessage}
        messagesWrapperRef={messagesWrapperRef}
      />
    </>
  );
};

const MessageCard = ({ message }: { message: Message }) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  if (message.sender.id === user.id) {
    return <MessageFromSelf message={message} />;
  }

  return <MessageFromOther message={message} />;
};

const MessageFromSelf = ({ message }: { message: Message }) => {
  const messageDate = moment(message.createdAt);
  const [delivered, setDelivered] = useState(false);
  const [seenBy, setSeenBy] = useState(message.seenBy);
  const socket = useSocket();

  if (message.isNew) {
    socket.once(`delivered:${message.id}`, () => {
      setDelivered(true);
    });
  }

  socket.once("seen:" + message.id, (messageSeenBy: any[]) =>
    setSeenBy(messageSeenBy)
  );

  return (
    <div className="chat chat-end flex flex-row-reverse gap-8">
      <Link
        className="chat-image avatar placeholder"
        to={`/user/${message.sender.username}`}
      >
        <div className="w-12 rounded-md bg-gray-500">
          {message.sender.avatar && <img src={message.sender.avatar} />}
          {!message.sender.avatar && (
            <span className="text-xl">{message.sender.firstName[0]}</span>
          )}
        </div>
      </Link>
      <div className="chat-bubble bg-indigo-500">
        <div>
          {message.media && <MesssageImage image={message.media} />}
          <p className="text-white max-w-lg whitespace-pre-wrap">
            {message.text}
          </p>
        </div>
        <div className="flex gap-1 text-slate-300/70 items-center justify-end">
          <span className="text-xs">{messageDate.format("hh:mm a")}</span>
          {message.isNew && !delivered ? (
            <Clock4 size={16} />
          ) : (
            <CheckCheck color={seenBy.length ? "#00caff" : "#ddd"} size={16} />
          )}
        </div>
      </div>
    </div>
  );
};

const MessageFromOther = ({ message }: { message: Message }) => {
  const messageDate = moment(message.createdAt);
  const socket = useSocket();
  const { dispatch } = useContext(roomsContext);
  const { ref, inView } = useInView();
  const {
    state: { user },
  } = useContext(AuthContext);
  useEffect(() => {
    if (!message.seenBy.includes(user.id) && inView) {
      socket?.emit("seen", { messageId: message.id });
      dispatch({
        type: "DECREMENT_UNREAD_COUNT",
        payload: { roomId: message.roomId },
      });
    }
  }, [inView]);
  return (
    <div className="chat chat-start flex gap-8" ref={ref}>
      <Link
        className="chat-image avatar placeholder"
        to={`/user/${message.sender.username}`}
      >
        <div className="w-12 rounded-md bg-gray-500">
          {message.sender.avatar && <img src={message.sender.avatar} />}
          {!message.sender.avatar && (
            <span className="text-xl">{message.sender.firstName[0]}</span>
          )}
        </div>
      </Link>
      <div className="chat-bubble">
        <div>
          {message.media && <MesssageImage image={message.media} />}
          <p className="text-white max-w-lg whitespace-pre-wrap">
            {message.text}
          </p>
        </div>
        <div className="flex gap-1 text-slate-300/70 items-center justify-end">
          <span className="text-xs">{messageDate.format("hh:mm a")}</span>
        </div>
      </div>
    </div>
  );
};

const ScrollDownButton = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    containerRef.current?.addEventListener("scroll", () => {
      const wrapper = containerRef.current;
      wrapper?.scrollTop! < -200 ? setVisible(true) : setVisible(false);
    });
  }, []);

  return (
    <button
      className={`btn btn-square fixed z-10 ${!visible && "hidden"}`}
      onClick={() => {
        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <ArrowDown />
    </button>
  );
};

const MesssageImage = ({ image }: { image: string }) => {
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <img
        src={image}
        className="max-w-md max-h-60 h-auto w-auto cursor-pointer rounded-md"
        onClick={() => imageDialogRef.current?.showModal()}
      />
      <dialog className="modal" ref={imageDialogRef}>
        <div className="modal-box">
          <img src={image} className="h-auto w-auto" />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default MessagesWrapper;
