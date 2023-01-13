import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from 'react';
import './App.css';
import './styles/general.css';
import Home from './components/Home';
import Battle from './components/Battle';

const stats = require('./data/stats.json');

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home stats={stats}/>
  }, {
    path: "/battle/:id",
    element: <Battle stats={stats}/>
  }
]);

export const StatsContext = React.createContext({});

function App() {

  const [statsValue, setStatsValue] = React.useState({
    exp: 0,
    level: 1,
    money: 0
  });

  return (
    <StatsContext.Provider value={[statsValue, setStatsValue]}>
      <div className="App">
        <div className="App-title">
          Simulation combat style RPG
        </div>
        <RouterProvider router={router} />
      </div>
    </StatsContext.Provider>
  );
}

export default App;
