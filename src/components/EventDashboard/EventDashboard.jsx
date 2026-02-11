import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { formatEventForDisplay } from '../../utils/keyboardUtils';
import './EventDashboard.css';

const EventDashboard = forwardRef((props, ref) => {
  const [events, setEvents] = useState([]);
  
  const addEvent = (eventDetails) => {
    setEvents(prev => [...prev, {
      ...eventDetails,
      id: Date.now() + Math.random(),
      displayText: formatEventForDisplay(eventDetails)
    }]);
  };
  
  const addAction = (action) => {
    setEvents(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: 'action',
      displayText: `Action: ${action}`,
      timestamp: Date.now()
    }]);
  };
  
  useImperativeHandle(ref, () => ({
    addEvent,
    addAction
  }));
  
  return (
    <div className="event-dashboard" data-test-id="event-dashboard">
      <div className="dashboard-header">
        <h3>Event Dashboard</h3>
      </div>
      <div className="event-log-list" data-test-id="event-log-list">
        {events.map(event => (
          <div 
            key={event.id} 
            className="event-log-entry"
            data-test-id="event-log-entry"
          >
            <span className="event-text">{event.displayText}</span>
            <span className="event-timestamp">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

EventDashboard.displayName = 'EventDashboard';

export default EventDashboard;
