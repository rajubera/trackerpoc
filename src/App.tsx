import { useState } from "react";
import "./App.css";

import Auth from "./Auth";
import TrackingScreen from "./Tracking";

function App() {
  const [user, setUser] = useState<{ name: string }>();
  return (
    <div className="App">
      <header>
        <a target="_blank">
          <img src="./clockify.webp" className="logo" alt="Vite logo" />
        </a>
        <h1>Face Authentication & Screenshot Recorder</h1>
        {user && <h3> Welcome {user?.name}</h3>}
      </header>

      {!user ? (
        <Auth
          onLoginSuccess={(userPayload) => {
            setUser(userPayload);
          }}
        ></Auth>
      ) : (
        <TrackingScreen></TrackingScreen>
      )}
      <p className="footer">This app is a POC created by Raju Bera</p>
    </div>
  );
}

export default App;
