import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

function Statistics() {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => {
            setTrainings(Object.values(Array.from(_(data)
                .groupBy('activity')))
                .map(activity => ({
                    activity: activity[0].activity,
                    duration: activity[0].duration,
                    total: _.sumBy(activity, activity => activity.duration)
                    })
                )
            )
        })
        .catch(err => console.error(err))
    }

    if (trainings) {
        return(
            <BarChart width={800} height={400} data={trainings}>
            <XAxis dataKey="activity" />
            <YAxis label={{ value: 'duration (min)', angle: -90, position: 'insideLeft' }}/>
            <Tooltip />
            <Bar dataKey="duration" fill="#8884d8">
                <LabelList dataKey="duration" position="top" />
            </Bar>
            </BarChart>
        )
    } else {
        return <div>No data to show!</div>
    }
}

export default Statistics;