import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className='home-container'>
      <img
        src='https://img.freepik.com/premium-vector/event-management-wedding-planner-manager-planning-event-conference-party_501813-2157.jpg'
        className='event-image'
        alt='Event Management'
      />
      <h2 className='welcome-style'>Welcome to EventEase, your ultimate tool for managing and organizing events effortlessly. Track, update, and share your events all in one place!</h2>
    </div>
  );
};

export default Home;
