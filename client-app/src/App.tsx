import { Routes, Route, useLocation } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./components/Signup";
import Answers from "./components/Answers";
import Navbar from "./components/Navbar"; // Make sure to import your Navbar component

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <div>
      {showNavbar && <Navbar />} {/* This ensures Navbar is not shown on the signup page */}
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/answers/:id" element={<Answers />} />
      </Routes>
    </div>
  );
};

export default App;
