import { AddCircleOutlineOutlined, DeleteOutlineOutlined, DownloadOutlined } from '@mui/icons-material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import FileSaver from 'file-saver';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import AddPatientReport from './patientReports/AddPatientReport';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import ExtractBloodReport from './ExtractBloodReport';

const UploadedFilesTable = ({ data, handleBack, selectedPatientName, selectedData }) => {

    const formatDateTime = (isoDate) => {
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
    const apiUrl = process.env.REACT_APP_API_URL;

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [patientData, setPatientData] = useState(null);
    const [isAddAttachmentOpen, setisAddAttachmentOpen] = useState(false)
    const [attachmentData, setattachmentData] = useState([]);
    const getPatientDetail = async () => {
        try {
            const response = await fetch(`${apiUrl}/getOnePatientDetls/${data}`);
            if (response.ok) {
                const jsonResponse = await response.json();
                setPatientData(jsonResponse);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    }
    const fetchUploadedFiles = async () => {
        try {
            if (data) {
                const response = await fetch(`${apiUrl}/getPatientReports/${data}`);
                if (response.ok) {
                    const jsonResponse = await response.json();
                    setUploadedFiles(jsonResponse);
                }
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };
    useEffect(() => {
        fetchUploadedFiles()
        getPatientDetail()
    }, []);

    const [isViewReportOpen, setisViewReportOpen] = useState(false)
    const viewReport = async (file) => {
        setisViewReportOpen(true)
    }

    const CloseReport = async (file) => {
        setisViewReportOpen(false)
    }

    const deleteAttachmentData = async (fileID) => {
        try {
            let payload = {
                "created_by": '2'
            }
            const res = await fetch(`${apiUrl}/deleteAttachment/${fileID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                NotificationManager.success(data.message);
                fetchUploadedFiles();
            } else {
                const data = await res.json();
                NotificationManager.error(data.message)
            }

        } catch (error) {
            console.error('Error Deleting report:', error);

        }
    }

    const handleDownload = async (file) => {
        try {
            let payload = {
                "filePath": file
            }
            const res = await fetch(`${apiUrl}/downloadattachment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
                body: JSON.stringify(payload),
            })
            console.log('result: ', res);
            if (res.ok) {
                const blob = await res.blob();
                const blobfile = new Blob([blob])
                FileSaver.saveAs(blobfile, file)
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    }

    const addAttachmentTab = () => {
        setisAddAttachmentOpen(true);
    }

    return (
        <>
            <div className="sub-container">
                <div className="head">
                    <div style={{ display: 'flex', gridGap: '10px', alignItems: 'center', marginBottom: '4px' }}
                        className="flex gap-10 items-center mb-4">
                        <IconButton className='icon-action'>
                            <Tooltip title='back'>
                                <ArrowCircleLeftIcon onClick={handleBack} className='icon-action' />
                            </Tooltip>
                        </IconButton>
                        <h3 className="text-lg font-semibold">Files for Batch ID: {selectedBatch}</h3>
                    </div>
                    <div className='icon-manage' style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton className='bx'>
                            <Tooltip className='bx' title='Report details refresh'>
                                <RefreshIcon className='bx' onClick={fetchUploadedFiles} />
                            </Tooltip>
                        </IconButton>
                        <IconButton className='bx'>
                            <Tooltip className='bx' title='Add Report'>
                                <AddCircleOutlineOutlined className='bx'
                                    onClick={() => addAttachmentTab(null)}
                                />
                            </Tooltip>
                        </IconButton>
                    </div>
                </div>
                <Paper className='table-patient-container'>
                    <TableContainer component={Paper} style={{ backgroundColor: 'whitesmoke' }}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead style={{ backgroundColor: 'ActiveBorder' }}>
                                <TableRow>
                                    <TableCell style={{ color: 'white', width: '250px' }}>File Name</TableCell>
                                    <TableCell style={{ color: 'white' }}>File Type</TableCell>
                                    <TableCell style={{ color: 'white', width: '350px' }}>Description</TableCell>
                                    <TableCell style={{ color: 'white', width: '200px' }}>Date of Upload</TableCell>
                                    <TableCell style={{ color: 'white', textAlign: 'center' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {uploadedFiles.map((file) => (
                                    <TableRow key={file.id}>
                                        <TableCell>
                                            {file.reportFileName != null && file.reportFileName.length > 25
                                                ? `${file.reportFileName.slice(0, 20)}...`
                                                : file.reportFileName}
                                        </TableCell>
                                        <TableCell>{file.reportType}</TableCell>
                                        <TableCell>{file.description}</TableCell>
                                        <TableCell>{formatDateTime(file.reportUploadDate)}</TableCell>
                                        <TableCell align="center" className='action-items'>
                                            <IconButton className='icon-action'
                                                onClick={() => viewReport(file)}>
                                                <Tooltip title='View Report'>
                                                    <FileOpenOutlinedIcon className='icon-action' />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton className='icon-action'
                                                onClick={() => handleDownload(file.reportFilePath)}>
                                                <Tooltip title='Download Report'>
                                                    <FileDownloadOutlinedIcon className='icon-action' />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton className='icon-action'
                                                onClick={() => deleteAttachmentData(file.id)}>
                                                <Tooltip title='Delete'>
                                                    <DeleteOutlineOutlined className='icon-action' />
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
    );
};

export default UploadedFilesTable;
