import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useLoginMutation } from "../generated/graphql";
import jwtManager from "../utils/jwt";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const [login, _] = useLoginMutation();

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const res = await login({
      variables: { loginInput: { username, password } },
    });

    if (res.data?.login.success) {
      jwtManager.setToken(res.data.login.accessToken as string);
      setIsAuthenticated(true);
      navigate("/");
    } else {
      if (res.data?.login.message) setError(res.data.login.message);
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="form-wrapper">
          <h1>Login</h1>
          {error && <span style={{ color: "red" }}>{error}</span>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nhập username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Nhập password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
