import { updateGroupAvatar } from "@/api/room";
import { useMutation } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const UpdateGroupAvatarDialog = ({ roomId }: { roomId: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [avatar, setAvatar] = useState<File | undefined>();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateGroupAvatar,
    onSuccess() {
      toast.success("group avatar updated successfully!");
    },
    onError() {
      toast.error("Something went wrong!");
    },
    onSettled() {
      dialogRef.current?.close();
    },
  });

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const avatarFile = e.target.files[0];
    if (avatarFile.size > 10 ** 6) {
      return toast.error("file size exceeded!");
    }
    setAvatar(avatarFile);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        id="room-avatar"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <label
        htmlFor="room-avatar"
        className="tooltip tooltip-bottom btn btn-ghost cursor-pointer inline-flex items-center"
        data-tip="update group avatar"
      >
        <Camera />
      </label>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box flex flex-col gap-4 items-center">
          <img
            className="max-w-xs max-h-80 h-auto w-auto rounded-md"
            src={avatar && window.URL.createObjectURL(avatar)}
            alt="group avatar"
          />
          <button
            className={`btn btn-outline btn-success ${
              isLoading && "btn-disabled"
            }`}
            onClick={() => {
              if (!avatar) {
                return toast.error("No avatar provided!");
              }
              mutate({ roomId, avatar });
            }}
          >
            {isLoading && <span className="loading loading-spinner"></span>}
            Save
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </>
  );
};

export default UpdateGroupAvatarDialog;
