import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import './appbar.css';

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const currentUser = localStorage.getItem('userData')
  const userProfile = JSON.parse(currentUser)
  const name = userProfile ? userProfile.fullName : null;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', gridColumnGap: '10px' }}>
        <div className="header-name">
        <h5>Hi, {name.slice(name.lastIndexOf(' ') + 1)}</h5>
        <p>{userProfile.role} </p>
        </div>
        <Tooltip title="Account settings">
          <IconButton style={{ marginLeft: '2px' }}
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}  >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#fff', color: '#000', fontWeight: 600 }}> U</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}

export default AccountMenu;