import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../generated/graphql";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [register, _] = useRegisterMutation();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await register({ variables: { registerInput: { username, password } } });
    navigate("/");
  };

  return (
    <>
      <div className="form-container">
        <div className="form-wrapper">
          <h1>Register</h1>
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
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
