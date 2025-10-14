import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Button } from "../components/ui/button";

import CForm from "../components/form/CForm";
import CInput from "../components/form/CInput";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import CSelect from "../components/form/CSelect";
import { registerSchema } from "../Schema/registerSchema";

const Register = () => {
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("from Data", data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <CForm
            onSubmit={onSubmit}
            resolver={registerSchema}
            defaultValues={{
              email: "",
              password: "",
              name: "",
              avatar: "",
              gender: "",
            }}
          >
            <CInput
              fieldName="name"
              label="Name"
              placeholder="Enter your name"
              type="name"
              required
            ></CInput>
            <CInput
              fieldName="avatar"
              label="Image"
              placeholder="Enter your image url"
              type="text"
              required
            ></CInput>
            <CSelect
              label="Gender"
              name="gender"
              placeholder="Select your gender"
              options={[
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
                {
                  label: "Other",
                  value: "other",
                },
              ]}
              required
            ></CSelect>
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
              Register
            </Button>
            <p className="text-sm text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </CForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
