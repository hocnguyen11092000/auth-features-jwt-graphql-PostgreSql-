import { NavLink, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useLogoutMutation } from "../generated/graphql";
import jwtManager from "../utils/jwt";

const Layout = () => {
  const { isAuthenticated, logoutClient } = useAuthContext();
  const [logoutServer, _] = useLogoutMutation();

  const logout = async () => {
    const checkLogout = window.confirm("Logout?");
    if (checkLogout) {
      logoutClient();
      await logoutServer({
        variables: { userId: jwtManager.getUserId()?.toString() as string },
      });
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>JWT AUTHENTICATION</h1>
      <nav style={{ paddingBottom: "1rem" }} className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="profile">Profile</NavLink>
        {isAuthenticated ? (
          <span className="logout" onClick={logout}>
            logout
          </span>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
      <Outlet></Outlet>
    </div>
  );
};

export default Layout;
