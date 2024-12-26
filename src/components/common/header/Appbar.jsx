import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Dashboard from '../../dashboard/Dashboard';
import Sidebar from '../sidebar/Sidebar';
import AccountMenu from './AccountMenu';
import Settings from '../../settings/Settings';
import UserDet from '../../userdetails/UserDet';
import EmailRecords from '../../emaildetails/EmailRecords';

import './appbar.css';
import ClientDet from '../../clientDetails/ClientDet';

const Appbar = () => {

    const [hideSidebar, sethideSidebar] = useState('')
    const hidebarOption = (e) => {
        sethideSidebar(e);
    }
    const value = useSelector(state => state.myReducer.value)
    const sideMenu = value === '' ? 1 : value;
    return (
        <>
            <Sidebar hideStyle={hideSidebar} />
            <div className='container-main' id={hideSidebar}>
                <section className='content'>
                    <div>
                        <nav>
                            {hideSidebar === '' ?
                                <MenuOpenIcon className='bx bx-menu'
                                    onClick={() => hidebarOption('hide')} />
                                :
                                <MenuOpenIcon className='bx bx-menu'
                                    onClick={() => hidebarOption('')} />
                            }
                            <div className="form-input">
                                {/* <img src={headerLogo} alt="Logo" /> */}
                                {/* <h4  className='nav-link'>Health Management System</h4> */}
                            </div>
                            <div className="header-profile">
                                <AccountMenu />
                            </div>

                        </nav>
                    </div>
                </section>
                {sideMenu === 1 && <Dashboard />}
                {sideMenu === 2 && <EmailRecords />}
                {sideMenu === 3 && <Settings />}
                {sideMenu === 5 && <ClientDet />}
                {sideMenu === 6 && <UserDet />}

            </div>
        </>
    )
}

export default Appbar