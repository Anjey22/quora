import { Routes, Route } from "react-router-dom";
import Mainpage from "./components/Mainpage";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./components/Signup";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/mainpage" element={<Mainpage />} />
      </Routes>
    </div>
  );
};

export default App;
