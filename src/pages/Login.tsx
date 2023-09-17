import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/user";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthProvider";
import jwtDecode from "jwt-decode";

const schema = yup
  .object({
    username: yup.string().min(4).max(30).required(),
    password: yup.string().min(6).max(100).required(),
  })
  .required();

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { dispatch } = useContext(AuthContext);

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onError(error: AxiosError) {
      if (error.response?.status === 400) {
        toast.error("Username or Password is incorrect!");
      }
    },
    onSuccess(response) {
      const token = response.data.token;
      axios.defaults.headers["Authorization"] = `bearer ${token}`;
      dispatch({ type: "LOGIN", payload: jwtDecode(token) });
      return navigate("/");
    },
  });

  return (
    <div className="max-sm:w-10/12 bg-neutral-focus w-1/4 max-md:w-1/2 mx-auto mt-32 max-sm:mt-12 text-center shadow-lg p-8 rounded-xl">
      <h3 className="text-4xl mb-3">Login</h3>
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
              <>
                <LogIn color="#ffffff" />
                Login
              </>
            )}
          </button>
          <div className="divider">OR</div>
          <Link to="/signup" className="link link-hover">
            Create New Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
