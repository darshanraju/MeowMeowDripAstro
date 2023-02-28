import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Form from "./Form";

const FormWrapper = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Form />
    </QueryClientProvider>
  );
};

export default FormWrapper;
