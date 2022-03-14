import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import jwtManager from "../utils/jwt";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuth: () => Promise<void>;
  logoutClient: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
  logoutClient: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = jwtManager.getToken();

    if (token) {
      setIsAuthenticated(true);
    } else {
      const success = await jwtManager.getRefreshToken();
      if (success) {
        setIsAuthenticated(true);
      }
    }
    console.log(token);
  }, []);

  const logoutClient = () => {
    jwtManager.deletetToken();
    setIsAuthenticated(false);
  };

  const AuthContextData = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
    logoutClient,
  };

  return (
    <AuthContext.Provider value={AuthContextData}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
