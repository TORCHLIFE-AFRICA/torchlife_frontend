import React from 'react'

let mainFooter=
{background:"#1A2E28",height:"200px",width:"100%",color:"white", display: "flex",
flexDirection: "row",justifyContent:"space-between",alignItems:"flex-start",padding: "20px 60px"}

export const HeroFooter = () => {
  return (
    <div style={mainFooter}>
      <div>
        <h1 style={{fontSize: "20px",fontWeight: "bold"}}>TorchLife</h1>
        <p>©2025 TorchLife. All rights reserved.</p>
      </div>
      
      <div>
        <h1 style={{fontSize: "20px",fontWeight: "bold"}}>Navigation Links</h1>
        <p>Home</p>
        <p>Browse Campaigns</p>
        <p>How It Works</p>
        <p>Start a Campaign</p>
        <p>Donate Now</p>
      </div>
      
      <div>
        <h1 style={{fontSize: "20px",fontWeight: "bold"}}>Contact</h1>
        <p>support@torchlife.org</p>
        <p>+234 706 901 4391</p>
        <p>Contact Us</p>
      </div>
      
      <div>
        <h1 style={{fontSize: "20px",fontWeight: "bold"}}>Social Media</h1>
        <p>X(Formerly Twitter)</p>
        <p>Instagram</p>
        <p>LinkedIn</p>
      </div>
    </div>
  )
}
