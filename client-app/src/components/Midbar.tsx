
import { useState } from 'react';
import { auth } from "../firebase/setup";
import Avatar from "react-avatar";
import ai from "../assets/ai.png";

const Midbar = () => {
  const [showFullCaption, setShowFullCaption] = useState(false);

  const toggleCaption = () => setShowFullCaption(!showFullCaption);

  const captionText = "Artificial Intelligence (AI) has become a transformative force across various industries, driving innovation, efficiency, and accuracy. Here’s a closer look at how AI is making a significant impact in different sectors.  AI's applications span across multiple industries, driving significant improvements and innovations. As AI technology continues to advance, its impact is expected to grow, further transforming how businesses operate and how services are delivered. AI’s importance stems from its ability to drive efficiency, innovation, and personalized experiences across industries while addressing complex challenges and shaping the future of technology and society. Embracing AI responsibly can lead to profound advancements that benefit businesses, individuals, and communities globally.";

  // Function to count words in the caption
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  const wordsCount = countWords(captionText);

  return (
    <div>
      <div className="midbar">
        <div className="midbar-top">
          <div className="midbar-avatar-input">
            <Avatar
              round
              size="35"
              name={auth?.currentUser?.emailVerified ? (auth.currentUser.displayName || 'A') : 'A'}
            />
            <input type="text" className="postmid" placeholder="What do you want to ask or share?" />
          </div>
        </div>
        <div className="midbar-actions">
          <h1><i className="fas fa-question-circle"></i> Ask</h1>
          <h1><i className="fas fa-pen-square"></i> Answer</h1>
          <h1><i className="fas fa-pen"></i> Post</h1>
        </div>
      </div>

      <div className="midbar">
        <div className="content">
          <Avatar
            round
            size="35"
            name={auth?.currentUser?.emailVerified ? (auth.currentUser.displayName || 'A') : 'A'}
          />
          <a>User Name</a>
        </div>
        {wordsCount <= 100 ? (
          <h1 className="captions">{captionText}</h1>
        ) : (
          <h1 className="captions">
            {showFullCaption ? captionText : `${captionText.split(' ').slice(0, 50).join(' ')}...`}
            {wordsCount > 100 && (
              <span className="toggle-caption" onClick={toggleCaption}>
                {showFullCaption ? " Show less" : " See more"}
              </span>
            )}
          </h1>
        )}
        <img src={ai} alt="" />
      </div>

      <div className="midbar">
        <div className="content">
          <Avatar
            round
            size="35"
            name={auth?.currentUser?.emailVerified ? (auth.currentUser.displayName || 'A') : 'A'}
          />
          <a>User Name</a>
        </div>
        <h1>Captions</h1>
        <div>
          <iframe
            width="590"
            height="375"
            src="https://www.youtube.com/embed/ex3C1-5Dhb8?si=jJU-ZQMkjnWTw5q6"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Midbar;
