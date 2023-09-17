import { inviteUser } from "@/api/invitation";
import { Room } from "@/api/room";
import { fetchContacts, User } from "@/api/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const InviteMembersToGroupDialog = ({ room }: { room: Room }) => {
  const inviteMembersDialogRef = useRef<HTMLDialogElement>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const { data } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    initialData: [],
  });
  useEffect(() => {
    setContacts(data);
  }, [data]);
  return (
    <>
      <button
        onClick={() => inviteMembersDialogRef.current?.showModal()}
        className="btn btn-ghost tooltip tooltip-bottom"
        data-tip="invite members"
      >
        <UserPlus />
      </button>
      <dialog ref={inviteMembersDialogRef} className="modal cursor-auto">
        <div className="modal-box max-w-xs">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Invite Members:</h3>
          {contacts
            .filter(
              (contact) =>
                room.members.findIndex((member) => member.id == contact.id) ==
                -1
            )
            .map((contact) => (
              <InviteUserCard user={contact} room={room} key={contact.id} />
            ))}
        </div>
      </dialog>
    </>
  );
};

const InviteUserCard = ({ user, room }: { user: User; room: Room }) => {
  const { mutate, isSuccess } = useMutation({
    mutationKey: ["invitations", room.id, user.id],
    mutationFn: inviteUser,
  });
  return (
    <div className="flex justify-between items-center mb-3 p-2">
      <div className="avatar placeholder">
        <div className="w-12 rounded-full bg-gray-500">
          {user?.avatar && <img src={user?.avatar} />}
          {!user?.avatar && (
            <span className="text-xl">{user?.firstName[0]}</span>
          )}
        </div>
      </div>
      <span>{user.fullName}</span>
      <button
        className={`btn btn-outline btn-success ${isSuccess && "btn-disabled"}`}
        onClick={() => mutate({ roomId: room.id, userId: user.id })}
      >
        Invite
      </button>
    </div>
  );
};

export default InviteMembersToGroupDialog;
