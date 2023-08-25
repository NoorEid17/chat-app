import { AuthContext } from "@/components/AuthProvider";
import { useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const schema = yup
  .object({
    username: yup.string().optional().max(30),
    firstName: yup.string().optional().min(4).max(30),
    lastName: yup.string().optional().min(2).max(30),
    oldPassword: yup.string().optional().max(100),
    newPassword: yup.string().optional().max(100),
    confirmPassword: yup
      .string()
      .optional()
      .max(100)
      .oneOf([yup.ref("newPassword"), ""], "Passwords do not match"),
    bio: yup.string().max(500).optional(),
    avatar: yup.mixed().optional(),
  })
  .required();

const Settings = () => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      username: "",
    },
  });
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess() {
      toast.success("User profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users", "token"] });
    },
  });
  const [avatarSrc, setAvatarSrc] = useState(user.avatar);

  return (
    <div className="mx-auto mt-12 max-w-lg min-w-max">
      <h3 className="text-3xl font-bold">Edit your profile:</h3>
      <form
        className="flex flex-col gap-3 mt-10 mb-10"
        onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
      >
        <div className="flex gap-10">
          <div className="avatar placeholder">
            <div className="w-32 rounded-full bg-gray-500">
              {avatarSrc && <img src={avatarSrc} />}
              {!avatarSrc && (
                <span className="text-4xl font-bold">{user.firstName[0]}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <input
              type="file"
              accept=".png, .jpg"
              className="file-input file-input-bordered file-input-primary w-full max-w-sm"
              {...register("avatar")}
              onChange={(e) => {
                clearErrors("avatar");
                if (!e.target.files) {
                  return;
                }
                const avatarFile = e.target.files[0];
                if (avatarFile.size > 10 ** 6 /* 1 MB */) {
                  e.target.value = "";
                  setAvatarSrc(user.avatar);
                  setError("avatar", {
                    message: "Avatar image should NOT exceed 1 MB!",
                  });
                  return;
                }
                const imageUrl = URL.createObjectURL(e.target.files[0]);
                setAvatarSrc(imageUrl);
              }}
            />
            <label className="label block">
              {errors.avatar && (
                <span className="label-text-alt text-red-400">
                  {errors.avatar.message?.toString()}
                </span>
              )}
            </label>
          </div>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("username")}
          />
          <label className="label">
            {errors.username && (
              <span className="label-text-alt text-red-400">
                {errors.username.message?.toString()}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("firstName")}
          />
          <label className="label">
            {errors.firstName && (
              <span className="label-text-alt text-red-400">
                {errors.firstName.message?.toString()}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("lastName")}
          />
          <label className="label">
            {errors.lastName && (
              <span className="label-text-alt text-red-400">
                {errors.lastName.message?.toString()}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Old Password</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("oldPassword")}
          />
          <label className="label">
            {errors.oldPassword && (
              <span className="label-text-alt text-red-400">
                {errors.oldPassword.message?.toString()}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("newPassword")}
          />
          <label className="label">
            {errors.newPassword && (
              <span className="label-text-alt text-red-400">
                {errors.newPassword.message?.toString()}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("confirmPassword")}
          />
          <label className="label">
            {errors.confirmPassword && (
              <span className="label-text-alt text-red-400">
                {errors.confirmPassword.message?.toString()}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Bio</span>
          </label>
          <textarea
            placeholder="Type here..."
            className="textarea textarea-bordered textarea-lg w-full text-sm text-slate-400 bg-neutral-focus"
            {...register("bio")}
          ></textarea>
        </div>
        <div className="flex">
          <button
            type="submit"
            className="btn btn-outline btn-success py-1 ml-auto"
          >
            {updateMutation.isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "SAVE"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
