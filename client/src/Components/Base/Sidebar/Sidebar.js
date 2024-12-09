import "./sidebar.css";
import { Link } from 'react-router-dom';
import React from 'react';
import { HiOutlinePencilAlt } from "react-icons/hi";

const Sidebar = ({ isHidden, toggleSidebar }) => {
  return (
    <div className={`Sidebar ${isHidden ? 'hidden' : ''}`}>

      {!isHidden && (
        <div className="toSidebar">
          <div className='talinks'>
            <div className='toa'>
              <Link to="/" className='toylink'>
                <HiOutlinePencilAlt />
              </Link>
            </div>
          </div>

          <div className="loginbutSlid">
            <Link to="/" className="toylink">
              <p>Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;