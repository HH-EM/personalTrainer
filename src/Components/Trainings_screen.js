import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

function Trainings() {
    const [trainings, setTrainings] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({msg: '', severity: ''});

    useEffect(() => {
        fetchTrainings();
    }, []);

    const openSnackbar = () => {
        setOpen(true);
    }
    
      const closeSnackbar = () => {
        setOpen(false);
    }

    const fetchTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrainings(data)) 
        .catch(err => console.error(err))
    }

    const deleteTraining = (id) => {
        var url = `https://customerrest.herokuapp.com/api/trainings/${id}`
        console.log(url);
        if (window.confirm('Are you sure? This will permanently delete the training.')) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setAlert({msg: 'Training deleted', severity: 'success'});
                    openSnackbar();
                    fetchTrainings();
                }
                else {
                    setAlert({msg: 'Something went wrong', severity: 'error'});
                    openSnackbar();
                }
            })
            .catch(err => console.error(err))
        }
    }

    const columns = [
        { 
            headerName: '',
            field: 'id',
            width: 60,
            suppressSizeToFit: true,
            cellRendererFramework: params =>
                <IconButton color='secondary' onClick={() => deleteTraining(params.value)}>
                    <DeleteIcon />
                </IconButton>
        },
        { field: 'activity', sortable: true, filter: true, cellStyle: {textAlign: 'left'} },
        { field: 'date', sortable: true, filter: true, cellStyle: {textAlign: 'left'}, valueFormatter(params) {
            return moment.utc(params.data.date).format('D.M.yyyy hh:mm a'); }},
        { field: 'duration', headerName: 'Duration (min)', sortable: true, filter: true, cellStyle: {textAlign: 'left'} },
        { headerName: 'Customer', sortable: true, filter: true, cellStyle: {textAlign: 'left'}, valueGetter(params) {
            return params.data.customer.firstname + ' ' + params.data.customer.lastname}}
    ]

    const onPageSizeChanged = (newPageSize) => {
        var value = document.getElementById('page-size').value;
        gridApi.paginationSetPageSize(Number(value));
    }

    const onGridReady = (params) => {
        setGridApi(params.api);
    }

    const onFirstDataRendered = (params) => {
        params.api.sizeColumnsToFit();
    }

    const onGridSizeChanged = (params) => {
        params.api.sizeColumnsToFit();
    }

    return(
        <div className="App"> 
            <div style={{ display: 'flex', marginBottom: 10, marginLeft: '46%', flexDirection: 'row' }}>
                <h3 style={{ color: '#3f51b5', marginTop: 'auto', marginBottom: 'auto' }}>Trainings</h3>
                <div style={{ flex: 1, textAlign: 'right', marginRight: '9.5%', marginTop:'auto' }}>
                    Rows displayed:
                    <select onChange={() => onPageSizeChanged()} id="page-size">
                        <option value='5' defaultValue='5'>5</option>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='50'>50</option>
                    </select>
                </div>
            </div> 
            <div className="ag-theme-material" style={{ height: 600, width: '90%', margin: 'auto' }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={5}
                    suppressCellSelection={true}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridReady={onGridReady}
                    domLayout={'autoHeight'}
                    onGridSizeChanged={onGridSizeChanged}
                    animateRows={true}
                />
                <Snackbar 
                    open={open}
                    autoHideDuration={3000}
                    onClose={closeSnackbar}
                >
                    <Alert severity={alert.severity} onClose={closeSnackbar}>{alert.msg}</Alert>
                </Snackbar>
            </div>
           
        </div>
    );
}

export default Trainings;