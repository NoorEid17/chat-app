import {
  acceptInvitation,
  fetchInvitations,
  Invitation,
  rejectInvitation,
} from "@/api/invitation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Invitations = () => {
  const {
    data: invitations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invitations"],
    queryFn: fetchInvitations,
  });

  return (
    <div className="flex gap-2 flex-col">
      {isLoading || isError ? (
        <span className="spinner loading-spinner"></span>
      ) : (
        <>
          {invitations.length == 0 && (
            <h1 className="text-center text-5xl text-primary font-bold w-max max-w-xl m-5 my-10">
              No Invitations for you!
            </h1>
          )}
          {invitations.map((invitation) => (
            <InvitationCard invitation={invitation} key={invitation.id} />
          ))}
        </>
      )}
    </div>
  );
};

const InvitationCard = ({ invitation }: { invitation: Invitation }) => {
  const queryClient = useQueryClient();
  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess() {
      toast.success("invitation accepted");
      queryClient.invalidateQueries(["invitations"]);
      queryClient.invalidateQueries(["rooms"]);
    },
  });
  const rejectMutation = useMutation({
    mutationFn: rejectInvitation,
    onSuccess() {
      toast.success("invitation rejected");
      queryClient.invalidateQueries(["invitations"]);
      queryClient.invalidateQueries(["rooms"]);
    },
  });

  return (
    <div className="flex gap-5 m-4 mx-10 items-center max-w-lg min-w-max">
      <div className="avatar placeholder w-20 h-20">
        <div className="rounded-full bg-gray-500">
          {invitation.from?.avatar && <img src={invitation.from?.avatar} />}
          {!invitation.from?.avatar && (
            <span className="text-xl">{invitation.from?.firstName[0]}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg">
          {invitation.from.fullName} invited you to join {invitation.room.name}
        </p>
        <div className="flex gap-2 justify-end self-end">
          {!(acceptMutation.isSuccess || rejectMutation.isSuccess) ? (
            <>
              <button
                className="btn btn-error"
                onClick={() => rejectMutation.mutate(invitation.id)}
              >
                Reject
              </button>
              <button
                className="btn btn-success"
                onClick={() => acceptMutation.mutate(invitation.id)}
              >
                Accept
              </button>
            </>
          ) : (
            <span>Action Done!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
