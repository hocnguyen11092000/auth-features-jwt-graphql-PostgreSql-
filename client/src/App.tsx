import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const [loading, setLoading] = useState(true);
  const { checkAuth } = useAuthContext();

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      setLoading(false);
    };
    authenticate();
  }, []);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Home></Home>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="/profile" element={<Profile></Profile>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
