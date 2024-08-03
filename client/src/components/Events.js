// client/src/components/Events.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEvents(response.data.events);
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view events.');
          navigate('/login?message=login'); // Redirect with query parameter
        } else {
          setError('Error fetching events.');
        }
      }
    };
    fetchEvents();
  }, [navigate]);

  const handleAddEvent = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api/events', { name, location, date, description }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents([...events, { ...response.data, description }]);
      setName('');
      setLocation('');
      setDate('');
      setDescription('');
      setError('');
    } catch (error) {
      setError('Error adding event.');
    }
  };

  const handleUpdateEvent = async (event) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`/api/events/${event.id}`, { name, location, date, description }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedEvents = events.map(e => e.id === event.id ? { ...e, name, location, date, description } : e);
      setEvents(updatedEvents);
      setEditingEvent(null);
      setError('');
    } catch (error) {
      setError('Error updating event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(events.filter(event => event.id !== id));
      setError('');
    } catch (error) {
      setError('Error deleting event.');
    }
  };

  return (
    <div>
      <h2>Events</h2>
      {error && <div className="error-message">{error}</div>}
      <input type="text" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <button className="event-card-add" onClick={editingEvent ? () => handleUpdateEvent(editingEvent) : handleAddEvent}>
        {editingEvent ? 'Update Event' : 'Add Event'}
      </button>

      <div className="events-list">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <h3>Name of the Event: {event.name}</h3>
            <p>Location: {event.location}</p>
            <p>Date: {event.date}</p>
            {event.weather && <div>{event.weather}</div>}
            <p>About the Event: {event.description}</p>
            <button className="event-card-edit" onClick={() => {
              setEditingEvent(event);
              setName(event.name);
              setLocation(event.location);
              setDate(event.date);
              setDescription(event.description);
            }}>Edit</button>
            <button className="event-card-delete" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
