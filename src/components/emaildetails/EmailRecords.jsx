import {
    VisibilityOutlined
} from '@mui/icons-material';

import { Button, IconButton, TablePagination, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { FaChevronCircleLeft, FaDownload } from 'react-icons/fa';
import { TbReload } from "react-icons/tb";
import './emailDet.css';
import { useDispatch, useSelector } from 'react-redux';

function formatDateTime(isoDate) {
    const date = new Date(isoDate);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    return date.toLocaleString(undefined, options);
}

function getStatusStyle(status) {
    return {
        color: status === "New" ? "blue" :
            status === "Inprogress" ? "orange" :
                status === "Failed" ? "red" :
                    status === "Success" ? "green" : "black",
    };
}


function EmailRecords() {

    const apiUrl = process.env.REACT_APP_API_URL;
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [isViewingAttachments, setIsViewingAttachments] = useState(false);
    const [subMenuData, setSubMenuData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/getemaildetails`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setRecords(data);
            setEmailFolderType('');
            setMailstatus('');
            setBatchId('')
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
        fetchData();
        fetchSubMenuData();
    }, []);


    // Filter state
    const [mailstatus, setMailstatus] = useState('');
    const [emailFolderType, setEmailFolderType] = useState('');
    const [clientFilter, setclientFilter] = useState('');
    const [batchId, setBatchId] = useState('');

    // const clientID = useSelector(state => state.myReducer.clientID)

    const filteredRecords = records.filter((item) =>
        (!batchId || (item.batchId || '').toLowerCase().includes(batchId.toLowerCase())) &&
        (!mailstatus || item.status.toLowerCase() === mailstatus.toLowerCase()) &&
        (!emailFolderType || item.emailFolderType.toLowerCase() === emailFolderType.toLowerCase()) &&
        (!clientFilter || item.clientId === parseInt(clientFilter))
    );

    const handleView = async (record) => {
        try {
            const response = await fetch(`${apiUrl}/getEmailAttachments/${record.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setAttachments(data);
            setSelectedBatch(record.batchId);
            setIsViewingAttachments(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (data) => {
        try {
            let payload = {
                "filePath": data.fileURL
            }
            const res = await fetch(`${apiUrl}/downloadAttachmens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                const blob = await res.blob();
                const blobfile = new Blob([blob])
                FileSaver.saveAs(blobfile, data.fileName)
            }
        } catch (error) {
            console.error('Error fetching files:', error);

        }
    }


    const getOneFileandDownload = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/getOneAttachment/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const resData = await response.json();
            let payload = {
                "filePath": resData.data.fileURL
            }
            const res = await fetch(`${apiUrl}/downloadAttachmens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                const blob = await res.blob();
                const blobfile = new Blob([blob])
                FileSaver.saveAs(blobfile, resData.data.fileName)
            }
        } catch (error) {
            console.error('Error fetching files:', error);

        }
    }

    const handleBack = () => {
        setIsViewingAttachments(false);
        setSelectedBatch(null);
    };


    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    // Handle Pagination
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const clearSearch = () => {
        setBatchId('')
        setEmailFolderType('')
        setclientFilter('')
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <div className="container">
                {isViewingAttachments ? (<></>) :
                    <div className="head-title">
                        <div className="sesstion-header-name" style={{ display: 'flex', gridGap: '10px', alignItems: 'center' }}>
                            <h2>All Email details</h2>
                        </div>
                    </div>
                }
                <div className="table-data">
                    <section className='main-container'>
                        {!isViewingAttachments ? (
                            <>
                                <div className="sub-container">
                                    <div className="head">
                                        <div className="search-filter">
                                            <input type="text" placeholder="Search with Batch ID"
                                                value={batchId}
                                                onChange={(e) => setBatchId(e.target.value)}
                                            />
                                            <select className="jm-search-select"
                                                value={clientFilter}
                                                onChange={(e) => setclientFilter(e.target.value)}>
                                                <option>Select Client</option>
                                                {subMenuData.map((item) => (
                                                    <option value={item.id}>{item.clientName}</option>
                                                ))}
                                            </select>
                                            <select className="jm-search-select"
                                                value={emailFolderType}
                                                onChange={(e) => setEmailFolderType(e.target.value)}>
                                                <option>Select Email Folder Type</option>
                                                <option value="Inbox">Inbox</option>
                                                <option value="Not Processed">Not Processed</option>
                                                <option value="Success">Success</option>
                                            </select>

                                            <Button style={{ height: '20px', fontSize: '10px', width: '25px' }}
                                                variant="contained" color="error" onClick={clearSearch}>
                                                Clear
                                            </Button>
                                        </div>
                                        <div className='icon-action' >
                                            <IconButton className='icon-action' >
                                                <Tooltip title='Refresh'>
                                                    <TbReload onClick={fetchData} className='icon-action' />
                                                </Tooltip>
                                            </IconButton>
                                        </div>
                                    </div>
                                    <Paper className='table-patient-container'>
                                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                            <Table size='small' aria-label="a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Batch ID</TableCell>
                                                        <TableCell align="left">Sender Name</TableCell>
                                                        <TableCell align="left">Sender ID</TableCell>
                                                        <TableCell align="left"> Receiver ID</TableCell>
                                                        <TableCell align="left">Received Date</TableCell>
                                                        <TableCell align="left">Status</TableCell>
                                                        <TableCell align="left">Status Reason </TableCell>
                                                        <TableCell >Mailbox Type</TableCell>
                                                        <TableCell >Email Folder</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredRecords
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, index) => {
                                                            return (
                                                                <TableRow key={row.id}>
                                                                    <TableCell component="td" scope="row"> {row.batchId} </TableCell>
                                                                    <TableCell align="left">{row.senderName}</TableCell>
                                                                    <TableCell align="left">{row.senderId}</TableCell>
                                                                    <TableCell align="left">{row.receiverId}</TableCell>
                                                                    <TableCell align="left">{formatDateTime(row.receivedDateTime)}</TableCell>
                                                                    <TableCell align="left" style={getStatusStyle(row.status)}>
                                                                        {row.status}
                                                                    </TableCell>
                                                                    <TableCell align="left">{row.statusReason}</TableCell>
                                                                    <TableCell component="td" scope="row"> {row.mailBoxType}  </TableCell>
                                                                    <TableCell align="left">{row.emailFolderType}</TableCell>
                                                                    <TableCell align="center" className='action-items'>
                                                                        <IconButton className='icon-action' >
                                                                            <Tooltip title='View'>
                                                                                <VisibilityOutlined onClick={() => handleView(row)} className='icon-action' />
                                                                            </Tooltip>
                                                                        </IconButton>
                                                                        <IconButton className='icon-action' >
                                                                            {row.status === 'Success' ?
                                                                                <Tooltip title='Download'>
                                                                                    <FaDownload onClick={() => getOneFileandDownload(row.id)}
                                                                                        className='icon-action' />
                                                                                </Tooltip>
                                                                                :
                                                                                <></>}
                                                                        </IconButton>
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
                                            count={filteredRecords === undefined ? null : filteredRecords.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="sub-container">
                                    <div className="head">
                                        <div style={{ display: 'flex', gridGap: '10px', alignItems: 'center', marginBottom: '4px' }}
                                            className="flex gap-10 items-center mb-4">
                                            <IconButton className='icon-action'>
                                                <Tooltip title='back'>
                                                    <FaChevronCircleLeft onClick={handleBack}
                                                        className='icon-action' />
                                                </Tooltip>
                                            </IconButton>
                                            <h3 className="text-lg font-semibold">Files for Batch ID: {selectedBatch}</h3>
                                        </div>
                                    </div>
                                    <Paper className='table-patient-container'>
                                        <TableContainer component={Paper} style={{ backgroundColor: 'whitesmoke' }}>
                                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                                <TableHead style={{ backgroundColor: 'ActiveBorder' }}>
                                                    <TableRow>
                                                        <TableCell style={{ color: 'white', width: '250px' }}>File Name</TableCell>
                                                        <TableCell style={{ color: 'white' }}>Received Date</TableCell>
                                                        <TableCell style={{ color: 'white', width: '350px' }}>Status</TableCell>
                                                        <TableCell style={{ color: 'white', width: '200px' }}>Status Reason</TableCell>
                                                        <TableCell style={{ color: 'white', textAlign: 'center' }}>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {attachments.map((file) => (
                                                        <TableRow key={file.id}>
                                                            <TableCell>
                                                                {file.fileName != null && file.fileName.length > 25
                                                                    ? `${file.fileName.slice(0, 20)}...`
                                                                    : file.fileName}
                                                            </TableCell>
                                                            <TableCell>{formatDateTime(file.receivedDateTime)}</TableCell>
                                                            <TableCell>{file.status}</TableCell>
                                                            <TableCell>{file.statusReason}</TableCell>
                                                            <TableCell align="center" className='action-items'>
                                                                <IconButton className='icon-action'
                                                                    onClick={() => handleDownload(file)}>
                                                                    <Tooltip title='Download Report'>
                                                                        <FaDownload className='icon-action' />
                                                                    </Tooltip>
                                                                </IconButton>

                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div >
        </>
    );
}
export default EmailRecords