import { DashboardCustomizeOutlined, LogoutOutlined } from '@mui/icons-material';
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import headerIcon from '../../../images/genrl-icon.png';
import { setClientID, setValue } from '../../redux/reducer';
import './sidebar.css';
import { Divider } from '@mui/material';

const Sidebar = ({ hideStyle }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const sidebarIcons = [
    { id: 1, menuItem: 'Dashboard', iconImg: <DashboardCustomizeOutlined className="bx" />, menuLink: '#' },
    { id: 2, menuItem: 'Email Details', iconImg: <HolidayVillageOutlinedIcon className="bx" />, menuLink: '#' },
  ];

  const commonSidebar = [


    {
      id: 10, menuItem: 'Logout',
      iconImg: <LogoutOutlined className='bx' />, menuLink: '/logout',
      styleClr: 'red'
    },
  ]

  const dispatch = useDispatch();
  const actStyle = useSelector((state) => state.myReducer.activeStyle);

  const [activeStyle, setActiveStyle] = useState(actStyle === '' ? 1 : actStyle);
  const [subMenuData, setSubMenuData] = useState([]);
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const setClientInfo = (data) => {
    dispatch(setClientID(data.id));
  };

  const styleChange = (data) => {
    setActiveStyle(data.id);
    dispatch(setValue(data.id));
    if (data.id === 2) {
      setOpenSubMenu(!openSubMenu);
      if (subMenuData.length === 0) {
        fetchSubMenuData();
      }
    } else {
      setOpenSubMenu(false);
    }
  };

  const fetchSubMenuData = async () => {
    try {
      const response = await fetch(`${apiUrl}/getAllClientNames`);
      const data = await response.json();
      setSubMenuData(data);
    } catch (error) {
      console.error('Error fetching submenu data:', error);
    }
  };

  useEffect(() => {
    if (activeStyle === 2 && !subMenuData.length) {
      fetchSubMenuData();
    }
  }, [activeStyle]);

  return (
    <section className="sidebar" id={hideStyle}>
      {/* Brand Header */}
      <a href="#" className="brand">
        <div className="form-input">
          <img src={headerIcon} className="img-icon2" alt="Logo" />
          {hideStyle === 'hide' ? (
            <img src={headerIcon} className="img-icon" alt="Logo" />
          ) : (
            <p className="img-logo" id={hideStyle}>
              AutoMailBot
            </p>
          )}
        </div>
      </a>

      {/* Main Sidebar Menu */}
      <ul className="side-menu top">
        {sidebarIcons.map((data, index) => (
          <React.Fragment key={index}>
            <MenuItem
              data={data}
              isActive={activeStyle === data.id}
              onClick={() => styleChange(data)}
            />
            {data.id === 2 && openSubMenu && subMenuData.length > 0 && (
              <SubMenu data={subMenuData} onClientClick={setClientInfo} />
            )}
          </React.Fragment>
        ))}
      </ul>
      <Divider/>
      <ul className='side-menu'>
        {commonSidebar.map((data, index) =>
          <li style={{ color: data.styleClr }} key={index}
            className={activeStyle === data.id ? 'active' : ''}
            onClick={() => styleChange(data)}>
            <a href={data.menuLink}>
              {data.iconImg}
              <span className="text">{data.menuItem}</span>
            </a>
          </li>
        )}
      </ul>
    </section>
  );
};

/** Menu Item Component */
const MenuItem = ({ data, isActive, onClick }) => (
  <li className={isActive ? 'active' : ''} onClick={onClick}>
    <a href={data.menuLink}>
      {data.iconImg}
      <span className="text">{data.menuItem}</span>
    </a>
  </li>
);

/** Submenu Component */
const SubMenu = ({ data, onClientClick }) => (
  <ul className="sub-menu">
    {data.map((item, index) => (
      <li key={index} onClick={() => onClientClick(item)}>
        <a href="#">
          <span className="text-sub">{item.clientName}</span>
        </a>
      </li>
    ))}
  </ul>
);

export default Sidebar;
