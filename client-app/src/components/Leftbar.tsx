import '../styles/home.css';
import cs from '../assets/cs.png';
import health from '../assets/health.png';
import mobile from '../assets/mobile.png';
import science from '../assets/science.png';
import technology from '../assets/technology.png';



const Leftbar = () => {
  return (
    <div className="leftbar">
        <div className="leftbar-item"> 
            <img src={cs} alt="Computer Science" />
            <span>Computer Science</span>
        </div>
        <div className="leftbar-item"> 
            <img src={health} alt="Health" />
            <span>Health</span>
        </div>
        <div className="leftbar-item"> 
            <img src={mobile} alt="Mobile Technology" />
            <span>Mobile Technology</span>
        </div>
        <div className="leftbar-item"> 
            <img src={science} alt="Science" />
            <span>Science</span>
        </div>
        <div className="leftbar-item"> 
            <img src={technology} alt="Technology" />
            <span>Technology</span>
        </div>
        <div className="leftbar-footer">
            <a href="#">About </a>
            <a href="#">Careers</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Advertise</a>
            <a href="#">Acceptable Use</a>
            <a href="#">Press</a>
            <a href="#">Your Ad Choices</a>
            <a href="#">Grievance Officer</a>
        </div>
    </div>
  );
}

export default Leftbar;
