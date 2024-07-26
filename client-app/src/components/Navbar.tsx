import React, { useState, useEffect } from 'react';
import '../assets/NavBar.css';
import { auth } from "../firebase/setup";
import quora from "../assets/quora.png";
import home from "../assets/home.png";
import clipboard from "../assets/clipboard.png";
import edit from "../assets/edit.png";
import group from "../assets/group.png";
import bell from "../assets/bell.png";
import search from "../assets/search.png";
import globe from "../assets/globe.png";
import Avatar from 'react-avatar';
import PostpopUp from './PostpopUp';

type NavbarProps = {
  setSearch: (value: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ setSearch }) => {
  const [post, setPost] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('A');
  

  const handleClose = () => setPost(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserDisplayName(user.displayName || 'A');
      } else {
        setUserDisplayName('A');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={quora} alt="Quora" />
        <img src={home} alt="Home" className='images' />
        <img src={clipboard} alt="Clipboard" className='images' />
        <img src={edit} alt="Edit" className='images' />
        <img src={group} alt="Group" className='images' />
        <img src={bell} alt="Bell" className='images' />
      </div>

      <div className="navbar-center">
        <img src={search} alt="Search" className='search' />
        <input type="text" placeholder="Search Quora" onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="navbar-right">
        <button className="try-quora-plus">Try Quora+</button>
        <Avatar
          round
          size="35"
          name={userDisplayName}
        />
        <img src={globe} alt="globe" className='globe images' />
        <button onClick={() => setPost(true)} className="add-question">Add question</button>
        <button className="menu-button">=</button>
      </div>
      <PostpopUp show={post} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
