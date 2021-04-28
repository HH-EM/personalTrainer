import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import "react-big-calendar/lib/css/react-big-calendar.css";

function CalendarScreen() {
    const localizer = momentLocalizer(moment);
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrainings(data)) 
        .catch(err => console.error(err))
    }

    const reservations = trainings.map((training) => {
        return {
            title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
            start: new Date(training.date),
            end: new Date(moment(training.date).add(training.duration, 'm').format()),
            allDay: false
        }
    })

    return(
        <div style={{ height: 700 }}>
            <Calendar
                events={reservations}
                startAccessor={reservations.start}
                endAccessor={reservations.end}
                localizer={localizer}
            />
            
      </div>
    );
}

export default CalendarScreen;