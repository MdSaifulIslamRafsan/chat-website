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
import { Link, useNavigate } from "react-router-dom";
import CSelect from "../components/form/CSelect";
import { registerSchema } from "../Schema/registerSchema";
import { toast } from "sonner";
import type { TErrorMessage } from "../Types/errorMessageTypes";
import { useRegisterMutation } from "../redux/features/register/registerApi";
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Register = () => {
 
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  const toastId = toast.loading("Registering...");

  try {
    
    if (!(data.avatar instanceof File)) {
      throw new Error("Please select a valid image file");
    }

    const formData = new FormData();
    formData.append("image", data.avatar);

    

    const uploadResponse = await fetch(image_hosting_api, {
      method: "POST",
      body: formData,
    });

    const imgData = await uploadResponse.json();
   

    if (!imgData.success) {
      throw new Error(imgData.error?.message || "Image upload failed");
    }

    const photoUrl = imgData.data.display_url;

    const userPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender,
      avatar: photoUrl,
    };

    const res = await register(userPayload).unwrap();

    if (res?.success) {
      toast.success(res?.message, {
        id: toastId,
        duration: 2000,
      });
      navigate(`/login`);
    }
  } catch (error: unknown) {
    console.error("Registration error:", error);
    toast.error((error as TErrorMessage).message || `Something went wrong`, {
      id: toastId,
      duration: 2000,
    });
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/10">
      <Card className="w-full max-w-md m-3 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <CForm
            styles="space-y-4"
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
              type="file"
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
              {isLoading ? "Register..." : "Register"}
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
