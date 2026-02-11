import React, { useRef } from 'react';
import Layout from './components/Layout/Layout';
import Editor from './components/Editor/Editor';
import EventDashboard from './components/EventDashboard/EventDashboard';
import './App.css';

function App() {
  const eventDashboardRef = useRef(null);
  
  const handleEvent = (eventDetails) => {
    if (eventDashboardRef.current) {
      if (eventDetails.type === 'action') {
        eventDashboardRef.current.addAction(eventDetails.displayText.replace('Action: ', ''));
      } else {
        eventDashboardRef.current.addEvent(eventDetails);
      }
    }
  };
  
  return (
    <div className="App">
      <Layout>
        <Editor onEvent={handleEvent} />
        <EventDashboard ref={eventDashboardRef} />
      </Layout>
    </div>
  );
}

export default App;
