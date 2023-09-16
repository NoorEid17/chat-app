import { Invitation } from "@/api/invitation";
import { useEffect } from "react";
import { toast, Toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const InvitationToast = ({
  invitation,
  t,
}: {
  invitation: Invitation;
  t: Toast;
}) => {
  useEffect(() => {
    setTimeout(() => toast.dismiss(t.id), 5000);
  }, []);

  return (
    <Link
      to="/invitations"
      className="flex gap-2 items-center max-w-xs p-4 m-4 bg-base-300 rounded-md"
    >
      <div className={`avatar placeholder`}>
        <div className="w-12 rounded-full bg-gray-500">
          {invitation.from?.avatar && <img src={invitation.from?.avatar} />}
          {!invitation.from?.avatar && (
            <span className="text-xl">{invitation.from?.firstName[0]}</span>
          )}
        </div>
      </div>
      <p>
        Invited you to join
        <strong className="text-blue-600 mx-1">{invitation.room.name}</strong>
      </p>
    </Link>
  );
};

export default InvitationToast;
