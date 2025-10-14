import { type FieldValues, type SubmitHandler } from "react-hook-form";

import { Link } from "react-router-dom";

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

const Login = () => {
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <CForm
            onSubmit={onSubmit}
            defaultValues={{ email: "", password: "" }}
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
