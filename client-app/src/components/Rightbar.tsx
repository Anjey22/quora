import eset from '../assets/eset.png';
import eset1 from '../assets/eset1.png';
import '../styles/home.css';

const Rightbar = () => {
  return (
    <div className="rightbar-container">
      <div className="ad-container">
        <a href="https://laptopfactory.com.ph/product/eset-nod32-antivirus-1-year-digital-license/" target="_blank" rel="noopener noreferrer">
          <img src={eset} alt="ads" className="ad-image" />
        </a>
      </div>
      <div className="ad-container midad">
        <a href="https://laptopfactory.com.ph/product/eset-nod32-antivirus-1-year-digital-license/" target="_blank" rel="noopener noreferrer">
          <img src={eset1} alt="ads" className="ad-image" />
        </a>
      </div>
      <div className="ad-label">
        <h3>Advertisement</h3>
      </div>
    </div>
  );
}

export default Rightbar;
