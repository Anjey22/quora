
import Leftbar from "./Leftbar";
import Mid from "./Mid";
import Rightbar from "./Rightbar";

type SearchProp = {
  search: string;
};

const Home = ({ search }: SearchProp) => {


  return (
    <div className="home">
      <div>
        <Leftbar/>
      </div>
      
      <div>
        <Mid search={search} />
      </div>
  
      <div>
      <Rightbar/>
      </div>
    </div>
  );
};

export default Home;