import { useState } from "react";
import Leftbar from "./Leftbar";
import Mid from "./Mid";

type SearchProp = {
  search: string;
};

const Home = ({ search }: SearchProp) => {
  const [menu, setMenu] = useState("");

  return (
    <div className="home">
      <div>
        <Leftbar setMenu={setMenu} />
      </div>
      <div>
        <Mid search={search} />
      </div>
    </div>
  );
};

export default Home;
