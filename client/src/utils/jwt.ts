import jwtDecode, { JwtPayload } from "jwt-decode";

const jwtManager = () => {
  const LOGOUT = "logout-jwt";
  let inMenmoryToken: string | null = null;
  let refreshTokenTimeOutId: number | null = null;
  let userId: number | null = null;

  const getToken = () => inMenmoryToken;
  const getUserId = () => userId;

  const setToken = (accessToken: string) => {
    inMenmoryToken = accessToken;

    //decode
    const decode = jwtDecode<JwtPayload & { userId: number }>(accessToken);
    userId = decode.userId;
    setRefreshTokenTimeOut((decode.exp as number) - (decode.iat as number));
    return true;
  };

  const abortRefreshToken = () => {
    if (refreshTokenTimeOutId) {
      window.clearTimeout(refreshTokenTimeOutId);
    }
  };

  const deletetToken = () => {
    inMenmoryToken = null;
    abortRefreshToken();
    return true;
    window.localStorage.setItem(LOGOUT, Date.now().toString());
  };

  // logout all tab
  window.addEventListener("storage", (event) => {
    if (event.key === LOGOUT) inMenmoryToken = null;
  });
  const getRefreshToken = async () => {
    try {
      const res = await fetch("http://localhost:4000/refresh-token", {
        credentials: "include",
      });
      const data = (await res.json()) as {
        success: boolean;
        accessToken: string;
      };
      setToken(data.accessToken);
      return true;
    } catch (error) {
      console.log(error);
      deletetToken();
      return false;
    }
  };

  const setRefreshTokenTimeOut = (delay: number) => {
    refreshTokenTimeOutId = window.setTimeout(
      getRefreshToken,
      delay * 1000 - 500
    );
  };

  return { getToken, setToken, getRefreshToken, deletetToken, getUserId };
};

export default jwtManager();
