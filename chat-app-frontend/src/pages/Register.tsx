import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import type { RegisterFormData } from "../Types/registerFromTypes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, control } =
    useForm<RegisterFormData>();
  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Form data:", data);
    try {
      // await registerUser(data).unwrap();
      reset();
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Name"
              {...register("name", { required: true })}
            />
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />

            <Controller
              name="gender"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Input
              placeholder="Image URL"
              {...register("avatar", { required: true })}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Register
            </Button>

            <p className="text-sm text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
