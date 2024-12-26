import { AddCircleOutlineOutlined, DeleteOutlineOutlined, ModeEditOutlineOutlined } from '@mui/icons-material';
import { Button, IconButton, TablePagination, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import DeleteRecord from './DeleteRecord';
import './clientdet.css';
import EditUserDetl from './clientDetForm/EditClientDetl';


function ClientDatadetls() {

  const apiUrl = process.env.REACT_APP_API_URL;
  const currentUser = localStorage.getItem('userData')
  const userProfile = JSON.parse(currentUser)

  const userId = userProfile ? userProfile.id : null;
  const userRole = userProfile ? userProfile.role : null;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [allClients, setAllClients] = useState([])

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/getAllClientInfo`);
      const result = await res.json()
      if (result.status === 'FAILED') {

      } else {
        setAllClients(result)
      }
    } catch (err) {
      console.log('Error fetching data', err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [searchText, setsearchText] = useState('')

  const clearSearch = () => {
    setsearchText('')
  }

  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [formMode, setformMode] = useState('')

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const addRecord = (row, add) => {
    setSelectedData(null);
    setformMode('add')
    setEditModalOpen(true);
  }

  const editRecord = (row, edit) => {
    setSelectedData(row);
    setformMode('edit')
    setEditModalOpen(true);
  }

  const viewRecord = (row, view) => {
    setSelectedData(row);
    setformMode('view')
    setEditModalOpen(true);
  }

  const [deletePop, setDeletePop] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);

  const deleteUser = (row) => {
    setSelectedData(row);
    setDeleteOption('Client')
    setDeletePop(true);
  }

  const handleSwitchChange = async (id, newStatus) => {
    try {
      let payload = {
        isActive: newStatus.target.checked ? 1 : 0
      }
      const res = await fetch(`${apiUrl}/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        NotificationManager.success(data.message)
        fetchData();
      } else {
        const data = await res.json();
        NotificationManager.error(data.message)
      }
    } catch (error) {
      NotificationManager.error(error)
    }
  }


  return (
    <>
      <section className='main-container'>
        <div className="order">
          <div className="head">
            <div className="search-filter">
              <input type="text" placeholder="Search with user name"
                onChange={e => setsearchText(e.target.value)}
                value={searchText}
              />
              <Button style={{ height: '20px', fontSize: '10px', width: '25px' }}
                variant="contained" color="error" onClick={clearSearch}>
                Clear
              </Button>
            </div>

            <div className='icon-manage' style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton className='bx'>
                <Tooltip className='bx' title='Add User Details'>
                  <AddCircleOutlineOutlined className='bx' onClick={() => addRecord(null)} />
                </Tooltip>
              </IconButton>
            </div>


          </div>
          <Paper className='table-container'>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table size='small' aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="row">Client ID</TableCell>
                    <TableCell >Client Name</TableCell>
                    <TableCell align="left">Email ID</TableCell>
                    <TableCell align="left">Validate Domain ID </TableCell>
                    <TableCell align="left">Active Status </TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allClients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell component="td" scope="row"
                            onClick={() => viewRecord(row)} className='row-selection'>
                            <div style={{ display: 'flex', gridGap: '5px', alignItems: 'center' }}>
                              {row.clientId}
                            </div>
                          </TableCell>
                          <TableCell component="td" scope="row">
                            {row.clientName}
                          </TableCell>
                          <TableCell align="left">{row.clientEmailID} </TableCell>
                          <TableCell align="left">{row.validdomainname}</TableCell>
                          <TableCell align="left">
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={row.activeStatus}
                                onChange={(event) => handleSwitchChange(row.id, event)}
                                color="secondary"
                                size="small"
                              />

                              {row.activeStatus ? 'Active' : 'Inactive'}
                            </label>

                          </TableCell>
                          <TableCell component="td" scope="row" className='action-items'>
                            <IconButton className='icon-action'>
                              <Tooltip title='Edit'>
                                <ModeEditOutlineOutlined onClick={() => editRecord(row)} className='icon-action' />
                              </Tooltip>
                            </IconButton>
                            {userRole === "ROLE_ADMIN" ?
                              <IconButton className='icon-action'>
                                <Tooltip title='Delete'>
                                  <DeleteOutlineOutlined onClick={() => deleteUser(row)} className='icon-action' />
                                </Tooltip>
                              </IconButton> : ''
                            }
                          </TableCell>

                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"

              count={allClients === undefined ? null : allClients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>

        {isEditModalOpen && (
          <EditUserDetl fetchData={fetchData} userData={userProfile} data={selectedData} formMode={formMode} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
        )}
        {deletePop && (
          <DeleteRecord deleteItem={deleteOption} data={selectedData} isDeletePop={deletePop} OnDeletePopClose={() => setDeletePop(false)} userId={userId} fetchData={fetchData} />
        )}
        <NotificationContainer />
      </section >
    </>
  );
}


export default ClientDatadetls