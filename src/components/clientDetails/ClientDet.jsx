import React from 'react';
import './clientdet.css';
import ClientDatadetls from './ClientDatadetls';


const ClientDet = () => {
  return (
    <>
      <div className="container">
        <div className="head-title">
          <div className="sesstion-header-name">
            <h2>Client Details</h2>
          </div>
        </div>
        <div className="table-data">
          <ClientDatadetls />
        </div>
      </div>
    </>
  )
}

export default ClientDet