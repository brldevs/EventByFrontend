import { useState, createContext, useContext } from "react";

export const FormContext = createContext();
export default function FormProvider({ children }) {
  const [data, setData] = useState({});

  const removeFormValues = async () => {
    setData(null);
  };

  const setFormValues = (values) => {
    setData((prevValues) => ({
      ...prevValues,
      ...values,
    }));
  };

  return (
    <FormContext.Provider value={{ data, setFormValues, removeFormValues }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormData = () => useContext(FormContext);
