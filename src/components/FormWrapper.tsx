import React from "react";
import { ReactNotifications } from "react-notifications-component";
import { QueryClient, QueryClientProvider } from "react-query";
import Form from "./Form";

const FormWrapper = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactNotifications />
      <Form />
    </QueryClientProvider>
  );
};

export default FormWrapper;
