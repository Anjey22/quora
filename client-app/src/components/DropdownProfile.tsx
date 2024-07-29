import React from 'react';

type DropdownProfileProps = {
  handleLogout: () => void;
};

const DropdownProfile: React.FC<DropdownProfileProps> = ({ handleLogout }) => {
  return (
    <div className="flex flex-col dropdownProfile">
      <ul className="flex flex-col gap-4">
        <li>Profile</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default DropdownProfile;
