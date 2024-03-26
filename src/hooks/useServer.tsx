import { makeRequest } from "@/utils/server";
import { createContext, useContext, useMemo, useState } from "react";

interface ServerContextType {
  login: (email: string, password: string) => Promise<void>;
}

const ServerContext = createContext<ServerContextType | null>(null);

const ServerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = useState<string | undefined>(undefined);

  const login = async (username: string, password: string) =>
    setJwt(
      await makeRequest({
        type: "login",
        data: { username, password },
      })
    );

  const value = useMemo<ServerContextType>(
    () => ({
      login,
    }),
    []
  );

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};

const useServer = (): ServerContextType => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServer must be used within a ServerContextProvider");
  }
  return context;
};

export { useServer, ServerContextProvider };
