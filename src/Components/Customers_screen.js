import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({msg: '', severity: ''});
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    const openSnackbar = () => {
        setOpen(true);
    }
    
      const closeSnackbar = () => {
        setOpen(false);
    }

    const deleteCustomer = (url) => {
        console.log(url);
        if (window.confirm('Are you sure? This will permanently delete the client and their trainings.')) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setAlert({msg: 'Customer deleted', severity: 'success'});
                    openSnackbar();
                    fetchCustomers();
                }
                else {
                    setAlert({msg: 'Something went wrong', severity: 'error'});
                    openSnackbar();
                }
            })
            .catch(err => console.error(err))
        }
    }

    const fetchCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    const addCustomer = (newCustomer) => {
        console.log(newCustomer);
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            body: JSON.stringify(newCustomer),
            headers: { 'Content-type' : 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                setAlert({msg: 'Customer added', severity: 'success'});
                openSnackbar();
                fetchCustomers();
                gridApi.paginationGoToLastPage();
            }
            else {
                setAlert({msg: 'Something went wrong', severity: 'error'});
                openSnackbar();
            }
        })
        .catch(err => console.error(err))
    }

    const editCustomer = (url, updatedCustomer) => {
        console.log(url, updatedCustomer);
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedCustomer),
            headers: { 'Content-type' : 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                setAlert({msg: 'Customer updated', severity: 'success'});
                openSnackbar();
                fetchCustomers();
            }
            else {
                setAlert({msg: 'Something went wrong', severity: 'error'});
                openSnackbar();
            }
        })
        .catch(err => console.error(err))
    }

    const addTraining = (newTraining) => {
        console.log(newTraining);
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'POST',
            body: JSON.stringify(newTraining),
            headers: { 'Content-type' : 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                setAlert({msg: 'Training added', severity: 'success'});
                openSnackbar();
            }
            else {
                setAlert({msg: 'Something went wrong', severity: 'error'});
                openSnackbar();
            }
        })
        .catch(err => console.error(err))
    }
        
    const columns = [
        { 
            headerName: '',
            field: 'links.0.href',
            width: 60,
            suppressSizeToFit: true,
            cellRendererFramework: params =>
                <IconButton color='secondary' onClick={() => deleteCustomer(params.value)}>
                    <DeleteIcon />
                </IconButton>
        },
        {
            headerName: '',
            field: 'links.0.href',
            width: 60,
            suppressSizeToFit: true,
            cellRendererFramework: params =>
                <EditCustomer link={params.value} customer={params.data} editCustomer={editCustomer} />
        },
        {
            headerName: 'Add training',
            field: 'links.0.href',
            width: 130,
            suppressSizeToFit: true,
            cellRendererFramework: params => 
                <AddTraining link={params.value} customer={params.data} addTraining={addTraining} />
        },
        { field: 'firstname', headerName: 'First Name', sortable: true, filter: true, cellStyle: {textAlign: 'left'} },
        { field: 'lastname', headerName: 'Last Name', sortable: true, filter: true, cellStyle: {textAlign: 'left'} },
        { field: 'email', sortable: true, filter: true, cellStyle: {textAlign: 'left'} },
        { field: 'phone', sortable: true, filter: true, cellStyle: {textAlign: 'left'}, width: 130 },
        { field: 'streetaddress', headerName: 'Address', sortable: true, filter: true, cellStyle: {textAlign: 'left'} },
        { field: 'postcode', sortable: true, filter: true, cellStyle: {textAlign: 'left'}, width: 120 },
        { field: 'city', sortable: true, filter: true, cellStyle: {textAlign: 'left'} }
    ]

    const onGridReady = (params) => {
        setGridApi(params.api);
    }

    const onPageSizeChanged = () => {
        var value = document.getElementById('page-size').value;
        gridApi.paginationSetPageSize(Number(value));
    }
  
    const onFirstDataRendered = (params) => {
        params.api.sizeColumnsToFit();      
    }

    const onGridSizeChanged = (params) => {
        params.api.sizeColumnsToFit();
    }

    return(
        <div className="App">
            <div style={{ display: 'flex', marginBottom: 10, marginLeft: '5%', flexDirection: 'row' }}>
                <AddCustomer addCustomer={addCustomer} />
                <h3 style={{ color: '#3f51b5', marginTop: 'auto', marginBottom: 'auto', flex: 5 }}>Customers</h3>
                <div style={{ flex: 1, textAlign: 'right', marginRight: '5.5%', marginTop:'auto' }}>
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
                    rowData={customers}
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
            </div>
            <Snackbar 
                open={open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
            >
                <Alert severity={alert.severity} onClose={closeSnackbar}>{alert.msg}</Alert>
            </Snackbar>
        </div>

    );
}

export default Customers;