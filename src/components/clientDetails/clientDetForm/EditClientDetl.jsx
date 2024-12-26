import { CancelOutlined } from '@mui/icons-material'
import { Button, Grid, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NotificationManager } from 'react-notifications'
import './editClient.css'

const EditClientDetl = ({ fetchData, userData, data, formMode, isOpen, onClose }) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const userID = userData ? userData.id : null;

    const [clientId, setclientId] = useState(data === null ? '' : data.clientId)
    const [clientName, setclientName] = useState(data === null ? '' : data.clientName)
    const [clientEmailID, setclientEmailID] = useState(data === null ? '' : data.clientEmailID)
    const [password, setpassword] = useState(data === null ? '' : data.password)
    const [clientGoogleID, setclientGoogleID] = useState(data === null ? '' : data.clientGoogleID)
    const [clientAuthorizationCode, setclientAuthorizationCode] = useState(data === null ? '' : data.clientAuthorizationCode)
    const [clientGoogleSecret, setclientGoogleSecret] = useState(data === null ? '' : data.clientGoogleSecret)
    const [clientAuthToken, setclientAuthToken] = useState(data === null ? '' : data.clientAuthToken)
    const [clientRefToken, setclientRefToken] = useState(data === null ? '' : data.clientRefToken)
    const [validdomainname, setvaliddomainname] = useState(data === null ? '' : data.validdomainname)


    const addVolunteerDetls = async (e) => {
        e.preventDefault();
        let payload = {
            "clientId": clientId,
            "clientName": clientName,
            "clientEmailID": clientEmailID,
            "password": password,
            "clientGoogleID": clientGoogleID,
            "clientAuthorizationCode": clientAuthorizationCode,
            "clientGoogleSecret": clientGoogleSecret,
            "clientAuthToken": clientAuthToken,
            "clientRefToken": clientRefToken,
            "validdomainname": validdomainname,
            "created_by": userID,
        }

        try {
            const res = await fetch(`${apiUrl}/createClient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                await fetchData();
                NotificationManager.success(data.message)
                onClose();
            } else {
                const data = await res.json();
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error.message)
        }
    }



    const updateVolunteerDetls = async () => {
        // e.preventDefault();
        let payload = {
            "clientId": clientId,
            "clientName": clientName,
            "clientEmailID": clientEmailID,
            "password": password,
            "clientGoogleID": clientGoogleID,
            "clientAuthorizationCode": clientAuthorizationCode,
            "clientGoogleSecret": clientGoogleSecret,
            "clientAuthToken": clientAuthToken,
            "clientRefToken": clientRefToken,
            "validdomainname": validdomainname,
            "created_by": userID,
        }

        try {
            if (formMode === 'edit') {
                const res = await fetch(`${apiUrl}/updateUser/${data.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    await fetchData();
                    NotificationManager.success(data.message)
                    onClose();

                } else {
                    const data = await res.json();
                    NotificationManager.success(data.message)
                }
            }
        } catch (error) {
            NotificationManager.success(error)
        }
    }

    return (
        <div>
            <Modal open={isOpen} >
                <>
                    <div style={{ display: "block" }}>
                        <div className="editjobmodal " id="editjobPopupModal" style={{ display: "block" }} role="dialog">
                            <div className="editjobmodal-dialog editjobmodal-lg editjobmodal-dialog-centered editjob-editjobmodal editjobmodal-dialog-scrollable">
                                <div className="editjobmodal-content">
                                    <CancelOutlined className="closed-editjobmodal" onClick={onClose} />
                                    <div className="editjobmodal-body">
                                        <div id="editjob-editjobmodal">
                                            <div className="editjob-form default-form">
                                                <div className="form-inner" style={formMode === 'view' ? { display: 'none' } : { display: 'block' }}>
                                                    <h3>{data === null ? 'Add Client Info' : 'Edit Client Info'}</h3>

                                                    <form method="put" >
                                                        <div className='jm-post-job-wrapper mb-40'>
                                                            <hr />
                                                            <Grid container spacing={2} className="row">
                                                                <Grid item xs={12} sm={2} md={2} className="forms-controfl">
                                                                    <label className='required-field'>Client ID</label>
                                                                    <input type="text" required
                                                                        value={clientId} placeholder="Client ID"
                                                                        onChange={(e) => setclientId(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={5} className="forms-controfl">
                                                                    <label className='required-field'>Client Name</label>
                                                                    <input type="text" placeholder="Client Name"
                                                                        value={clientName}
                                                                        onChange={(e) => setclientName(e.target.value)} required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} sm={4} md={5} className=" forms-controfl">
                                                                    <label className='required-field'>Client Email ID</label>
                                                                    <input type="text" placeholder="Client Email ID"
                                                                        value={clientEmailID}
                                                                        onChange={(e) => setclientEmailID(e.target.value)} required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label className='required-field'>Password</label>
                                                                    <input type="text" placeholder="password"
                                                                        value={password} required
                                                                        onChange={(e) => setpassword(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label>Google Client ID</label>
                                                                    <input type="text" placeholder="Google Client ID"
                                                                        value={clientGoogleID}
                                                                        onChange={(e) => setclientGoogleID(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4} className=" forms-controfl">
                                                                    <label className='required-field'>Google Client Secret</label>
                                                                    <input type="text" placeholder="Google Clent Secret"
                                                                        value={clientGoogleSecret} required
                                                                        onChange={(e) => setclientGoogleSecret(e.target.value)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} md={6} className=" forms-controfl">
                                                                    <label className='required-field'>Client Authorization Code</label>
                                                                    <input type="text" placeholder="Client Authorization Code"
                                                                        value={clientAuthorizationCode} required
                                                                        onChange={(e) => setclientAuthorizationCode(e.target.value)}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={12}>
                                                                <hr />
                                                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                                    {data === null ?
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={addVolunteerDetls}
                                                                            variant="contained" color="success">
                                                                            Create
                                                                        </Button>
                                                                        :
                                                                        <Button style={{ height: '25px' }}
                                                                            onClick={updateVolunteerDetls}
                                                                            variant="contained" color="success">
                                                                            Update
                                                                        </Button>
                                                                    }
                                                                </div>
                                                            </Grid>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </Modal >
        </div >
    )
}
export default EditClientDetl