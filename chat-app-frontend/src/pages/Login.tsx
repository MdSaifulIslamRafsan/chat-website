import { type FieldValues, type SubmitHandler } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import CForm from "../components/form/CForm";
import CInput from "../components/form/CInput";
import { loginSchema } from "../Schema/loginSchema";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/features/auth/authSlice";
import type { TErrorMessage } from "../Types/errorMessageTypes";
import { verifyToken } from "../utils/verifyToken";
import type { TUser } from "../Types/UserTypes";
import { socket } from "../utils/socket";

const Login = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("logging in...");
    try {
      const res = await login(data).unwrap();
      const token = res.data.accessToken;
      const userData = verifyToken(token) as TUser;
      dispatch(setUser({ user: userData, token }));
      toast.success(res?.message || `User login successfully`, {
        id: toastId,
        duration: 2000,
      });
      socket.connect();
      socket.emit("userId", userData.id);
      navigate(`/`);
    } catch (error: unknown) {
      toast.error(`something went wrong ${(error as TErrorMessage).message}`, {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-muted/10">
      <Card className="w-full max-w-md m-3 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <CForm
            styles="space-y-4"
            onSubmit={onSubmit}
            defaultValues={{ email: "demo@gmail.com", password: "Pa$$w0rd!" }}
            resolver={loginSchema}
          >
            <CInput
              fieldName="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              required
            ></CInput>
            <CInput
              fieldName="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              required
            ></CInput>
            <Button type="submit" className="w-full">
              Login
            </Button>

            <p className="text-sm text-center mt-3">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </CForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
