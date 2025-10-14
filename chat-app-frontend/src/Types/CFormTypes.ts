/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

export type TFormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};
export type TCForm = {
  onSubmit: SubmitHandler<FieldValues>;
  children: ReactNode;
} & TFormConfig;
