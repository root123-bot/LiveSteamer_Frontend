import { createContext, useState } from "react";

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
  addEvent: (matchId, metadataObj) => {},
});
