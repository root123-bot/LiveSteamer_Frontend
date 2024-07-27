import { createContext, useState, useContext } from "react";

// some props like 'haveExtraTime' will be updated by us by data from the match in db
// here the metadataobj in addEvent is 'event type' and other metadata obj required by that event...
// here metadataobj in addHome teams is { teamId, starting, sub, coach}
export const AppContext = createContext({
  matches: [],
  syncMatches: (incomingMatches) => {},
  addMatchDetails: (id, metadataObj) => {},
  removeMatch: (id) => {},
  addHomeTeam: (matchId, metadataObj) => {},
  addAwayTeam: (matchId, metadataObj) => {},
  setdidHaveExtraTime: (matchId, bool) => {},
  // above looks old and useless, for now lets go with one match... we can't afford to have one which 
  // support many matches
  matchEvents: [],
  addMatchEvent: (metadataObj) => {},
});

export const useCtx = () => {
  return useContext(AppContext);
};

function AppContextProvider({ children }) {
  const [matchEvents, setMatchEvents] = useState([]);

  const addMatchEvent = (metadataObj) => {
    console.log("EVENTS ", metadataObj);

    setMatchEvents(prevState => ([ ...prevState, metadataObj ]))
  }

  const value = {
    matchEvents,
    addMatchEvent
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
};

export default AppContextProvider;