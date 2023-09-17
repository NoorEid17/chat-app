import { ImagePlus, Send, Smile } from "lucide-react";
import { RefObject, useContext, useRef, useState } from "react";
import { useSocket } from "./SocketProvider";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "./AuthProvider";
import { toast } from "react-hot-toast";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const MessageInputBar = ({
  roomId,
  addMessage,
  messagesWrapperRef,
}: {
  roomId: string;
  addMessage: (msg: any) => void;
  messagesWrapperRef: RefObject<HTMLDivElement>;
}) => {
  const socket = useSocket();
  const {
    state: { user },
  } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  const submitHandler = async (data: any) => {
    const messageId = uuidv4();

    socket?.emit("message", {
      messageId,
      text: data.messageText,
      roomId,
    });

    addMessage({
      roomId,
      text: data.messageText,
      sender: user,
      id: messageId,
      isNew: true,
      delivered: false,
      seenBy: [],
    });

    messagesWrapperRef.current?.scrollTo({ top: 0 });

    reset();
  };
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const addEmojiToMessageText = (emoji: any) => {
    setValue("messageText", getValues("messageText") + emoji.native);
  };

  return (
    <form
      className="flex items-center w-full px-12 gap-4 max-sm:px-0"
      onSubmit={handleSubmit(submitHandler)}
    >
      <EmojiPickerDropdown addEmojiToMessageText={addEmojiToMessageText} />
      <UploadImage addMessage={addMessage} roomId={roomId} />
      <textarea
        className="focus:outline-none resize-none bg-transparent col-span-6 w-full h-7"
        onKeyDown={function (e) {
          const keyCode = e.which || e.keyCode;
          if (keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            submitBtnRef.current?.click();
          }
        }}
        placeholder="Type your message..."
        {...register("messageText", { required: true })}
      />
      <button className="" ref={submitBtnRef}>
        <Send />
      </button>
    </form>
  );
};

const UploadImage = ({
  addMessage,
  roomId,
}: {
  addMessage: (msg: any) => void;
  roomId: string;
}) => {
  const uploadImageDialogRef = useRef<HTMLDialogElement>(null);
  const [uploadingImage, setUploadingImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const socket = useSocket();
  const {
    state: { user },
  } = useContext(AuthContext);

  const handleUploadMediaChange = (files: FileList | null) => {
    if (!files || !files[0]) {
      return;
    }
    setUploadingImage(files[0]);
    uploadImageDialogRef.current?.showModal();
  };

  const sendMessageWithMedia = () => {
    if (!uploadingImage) {
      return;
    }
    if (uploadingImage.size > 10 ** 6 * 30) {
      toast.error("File Size Limit exceeded!");
    }

    const newMessage = {
      id: uuidv4(),
      isNew: true,
      delivered: false,
      sender: user,
      seenBy: [],
      roomId,
      text: caption,
      media: uploadingImage,
    };

    addMessage({
      ...newMessage,
      media: window.URL.createObjectURL(uploadingImage),
    });
    uploadImageDialogRef.current?.close();

    socket.emit("message", { ...newMessage, messageId: newMessage.id });
  };

  return (
    <>
      <label htmlFor="upload-media-input" className="cursor-pointer">
        <ImagePlus />
      </label>
      <dialog className="modal" ref={uploadImageDialogRef}>
        <div className="modal-box flex flex-col gap-2">
          <img
            src={
              uploadingImage ? window.URL.createObjectURL(uploadingImage) : ""
            }
            className="rounded-md"
          />
          <input
            className="input input-bordered w-full mt-2"
            type="text"
            placeholder="Type caption"
            onChange={(e) => setCaption(e.target.value)}
          />
          <button
            className="w-min self-end btn btn-ghost justify-end"
            onClick={sendMessageWithMedia}
          >
            Send
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <input
        hidden={true}
        type="file"
        id="upload-media-input"
        accept=".png, .jpg, .jpeg"
        onChange={(e) => handleUploadMediaChange(e.currentTarget.files)}
      />
    </>
  );
};

const EmojiPickerDropdown = ({
  addEmojiToMessageText,
}: {
  addEmojiToMessageText: (emoji: any) => void;
}) => {
  return (
    <div className="dropdown dropdown-top dropdown-end">
      <label tabIndex={0} className="btn btn-ghost m-1">
        <Smile />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <Picker data={data} onEmojiSelect={addEmojiToMessageText} />
      </ul>
    </div>
  );
};

export default MessageInputBar;
