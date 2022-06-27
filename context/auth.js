import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";
export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [data, setData] = useState({});
  const router = useRouter();

  const setAuthValues = async (values) => {
    setData((prevValues) => {
      return {
        ...prevValues,
        ...values,
      };
    });
  };

  const removeAuthValues = () => {
    setData({ token: "", result: "" });
  };
  useEffect(async () => {
    const token = localStorage.getItem("token");
    const result = JSON.parse(localStorage.getItem("result"));
    if (token && result) {
      await setAuthValues({ token, result });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ data, setAuthValues, removeAuthValues }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthData = () => useContext(AuthContext);
