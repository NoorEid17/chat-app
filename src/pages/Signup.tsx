import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/user";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const schema = yup
  .object({
    username: yup.string().min(4).max(30).required(),
    firstName: yup.string().min(4).max(30).required(),
    lastName: yup.string().min(4).max(30).required(),
    password: yup.string().min(6).max(100).required(),
  })
  .required();

const Signup = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onError(error: AxiosError) {
      if (error.response?.status === 400) {
        toast.error("Username or Password is incorrect!");
      }
    },
  });

  return (
    <div className="max-sm:w-10/12 bg-neutral-focus w-1/4 mx-auto mt-12 max-sm:mt-12 text-center shadow-lg p-8 rounded-xl">
      <h3 className="text-3xl mb-3">Create New Account</h3>
      <form onSubmit={handleSubmit((data: any) => loginMutation.mutate(data))}>
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
                {errors.username.message}
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
                {errors.firstName.message}
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
                {errors.lastName.message}
              </span>
            )}
          </label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full bg-neutral-focus"
            {...register("password")}
          />
          <label className="label">
            {errors.password && (
              <span className="label-text-alt text-red-400">
                {errors.password.message}
              </span>
            )}
          </label>
        </div>
        <div>
          <button
            className="btn btn-primary w-full hover:bg-primary-focus"
            type="submit"
          >
            {loginMutation.isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "SIGNUP"
            )}
          </button>
          <div className="divider">OR</div>
          <Link to="/login" className="link link-hover">
            Already Have An Account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
