import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateFnsUtils from '@date-io/date-fns';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

function AddTraining(props) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({
        activity: '',
        date: new Date(),
        duration: '',
        customer: ''
    })

    const handleClickOpen = () => {
        console.log(props.customer)
        setTraining({...training, customer : props.link})
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {
        console.log(training.date);
        props.addTraining(training);
        setOpen(false);
    }

    const handleChange = (date) => {
        setTraining({...training, date: date.toISOString() })
    }

    const inputChanged = (event) => {
        setTraining({...training, [event.target.name] : event.target.value});
    }

    return(
        <div>
            <IconButton color='primary' onClick={() => handleClickOpen()}>
                <AddBoxIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add training for {props.customer.firstname} {props.customer.lastname}</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker 
                            value={training.date} 
                            onChange={handleChange} 
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        margin="dense"
                        label="Activity"
                        name="activity"
                        value={training.activity}
                        onChange={inputChanged}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Duration"
                        name="duration"
                        value={training.duration}
                        onChange={inputChanged}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Min</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddTraining;