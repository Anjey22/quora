import React, { useState } from 'react';
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
import PostpopUp from'./PostpopUp'

const Navbar: React.FC = () => {
  const [post, setPost] = useState(false);

  const handleClose = () => setPost(false);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={quora} alt="Quora"/>
        <img src={home} alt="Home" className='images' />
        <img src={clipboard} alt="Clipboard" className='images' />
        <img src={edit} alt="Edit" className='images'/>
        <img src={group} alt="Group" className='images'/>
        <img src={bell} alt="Bell" className='images'/>
      </div>

      <div className="navbar-center">
        <img src={search} alt="Search" className='search' />
        <input type="text" placeholder="Search Quora" />
      </div>

      <div className="navbar-right">
        <button className="try-quora-plus">Try Quora+</button>
        <Avatar
          round
          size="35"
          name={auth?.currentUser?.emailVerified ? (auth.currentUser.displayName || 'A') : 'A'}
        />
        <img src={globe} alt="globe" className='globe images'/>
        <button onClick={() => setPost(true)} className="add-question">Add question</button>
        <button className="menu-button">=</button>
      </div>
      <PostpopUp show={post} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
