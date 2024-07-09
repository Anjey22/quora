
import '../assets/NavBar.css';
import quora from "../assets/quora.png";
import home from "../assets/home.png";
import clipboard from "../assets/clipboard.png";
import edit from "../assets/edit.png";
import group from "../assets/group.png";
import bell from "../assets/bell.png";
import search from "../assets/search.png";
import globe from "../assets/globe.png";
import Avatar from 'react-avatar';

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={quora} alt="Quora"/>
        <img src={home} alt="Home" className='image' />
        <img src={clipboard} alt="Clipboard" className='image' />
        <img src={edit} alt="Edit" className='image'/>
        <img src={group} alt="Group" className='image'/>
        <img src={bell} alt="Bell" className='image'/>
      </div>

      <div className="navbar-center">
        <img src={search} alt="Search" className='search' />
        <input type="text" placeholder="Search Quora" />
      </div>

      <div className="navbar-right">
        <button className="try-quora-plus image">Try Quora+</button>
        <Avatar round size='35' name='A'/>
        <img src={globe} alt="globe" className='globe image'/>

        <button className="add-question">Add question</button>
        <button className="menu-button">=</button>
      </div>
    </div>
  );
};

export default Navbar;
