import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import type { TCForm, TFormConfig } from "../../Types/CFormTypes";
import { Form } from "../ui/form";

const CForm = ({ onSubmit, children, resolver, defaultValues }: TCForm) => {
  const formConfig: TFormConfig = {};
  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }
  if (resolver) {
    formConfig["resolver"] = resolver;
  }
  const methods = useForm(formConfig);
  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    await onSubmit(data);
    methods.reset();
  };
  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {children}
        </form>
      </Form>
    </FormProvider>
  );
};

export default CForm;
