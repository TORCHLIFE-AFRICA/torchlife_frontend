/* src/App.tsx
import React from 'react';
import Button from './Buttons';
import '@/App.css'; // For .full-width-btn (add .full-width-btn { width: 100%; } here)


function App() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
    
      <h2>Buttons:</h2>

      
      <Button variant="filled">
        Start a Campaign
      </Button>

      
      <Button variant="filled" >
        Donate Now
      </Button>

      
      <Button variant="black-filled">
        Back
      </Button>

      
      <Button variant="filled">
        Sign Up
      </Button>
      
      
      <Button variant="filled">
        Log In
      </Button>
      
      
      <Button variant="filled">
        Submit Application
      </Button>

      
      <Button variant="filled">
        Next
      </Button>

      
      <Button variant="filled">
        Submit Campaign
      </Button>


      <Button variant="filled" >
        Track Campaign
      </Button>
      

      <Button variant="filled">
        View Details
      </Button>
      
      
      <Button variant="filled">
        View Campaign
      </Button>

      
      <Button variant="filled" >
        View Wallet
      </Button>
      
      
      <Button variant="black-outline">
        Back to Campaigns
      </Button>
      
      <Button disabled>
        Start a Campaign
      </Button>

      
      <Button variant="filled" >
        Add Funds
      </Button>
      
      
      <Button variant="black-outline">
        Withdraw
      </Button>
    </div>
  );
}

export default App;