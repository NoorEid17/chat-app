import { createGroup } from "@/api/room";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateGroupDialog = () => {
  type FormValues = {
    name: string;
  };

  const createGroupDialogRef = useRef<HTMLDialogElement>(null);
  const { register, handleSubmit } = useForm<FormValues>();
  const dialogCloseForm = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: createGroup,
    onSuccess: (room) => {
      toast.success("Room created!");
      navigate("/chats/" + room.id);
      dialogCloseForm.current?.submit();
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const submitHandler = (data: FormValues) => {
    mutate(data);
  };

  return (
    <div className="tooltip" data-tip="Create a group">
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => createGroupDialogRef.current?.showModal()}
      >
        <PlusIcon />
      </button>
      <dialog ref={createGroupDialogRef} className="modal">
        <div className="modal-box text-start">
          <h3 className="font-bold text-lg">Create Group:</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(submitHandler)}
          >
            <label className="text-lg font-bold mt-3">Name: </label>
            <input
              className="input"
              type="text"
              {...register("name", { required: true })}
            />
            <button className="btn btn-primary self-end">Create</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" ref={dialogCloseForm}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CreateGroupDialog;
