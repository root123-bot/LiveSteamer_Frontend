import NextProgress from "nextjs-progressbar";
import { useState } from "react";
import { AppContext } from "../store/AppContext";

// nested tertiary operator(?, :) acts like 'switch statement' and not like you know https://javascript.plainenglish.io/javascript-nested-ternary-operator-dc28551fb8c3

export default function MyApp({ Component, pageProps }) {
  const [matches, setMatches] = useState([]);

  function syncMatches(incomingMatches) {
    setMatches(incomingMatches);
  }

  // not used

  function removeMatch(id) {
    setMatches((currentMatches) => {
      return currentMatches.filter((value) => {
        Object.keys(value)[0] !== id;
      });
    });
  }

  function addMatchDetails(id, metadataObj) {
    // first check if id exist...
    console.log(
      "These are existed matches before adding a new id ",
      id,
      matches
    );
    setMatches((currentMatches) => {
      return [
        ...currentMatches,
        {
          [id]: {
            hometeam: {
              team: metadataObj.hteam,
              xtraMetadata: metadataObj.hextra,
              starting11: metadataObj.hstarting,
              sub: metadataObj.hsub,
              coach: metadataObj.hcoach,
            },
            awayteam: {
              team: metadataObj.ateam,
              xtraMetadata: metadataObj.aextra,
              starting11: metadataObj.astarting,
              sub: metadataObj.asub,
              coach: metadataObj.acoach,
            },
            extratime: metadataObj.etime,
            createdAt: metadataObj.createdAt,
            stadium: metadataObj.stadium,
          },
        },
      ];
    });
  }

  // not used
  function addHomeTeam(matchId, metadataObj) {
    const match = matches.find((value) => Object.keys(value)[0] === matchId);
    {
      /*then here we have our desired obj, now what i need is to update it
      i can have object which look like "{matchId: {...}}" remember i have this
      match id..*/
    }
    let updatedMatch = {
      [matchId]: {
        ...match.matchId,
        hometeam: {
          team: metadataObj.team,
          starting11: metadataObj.starting,
          sub: metadataObj.sub,
          coach: metadataObj.coach,
        },
      },
    };

    removeMatch(matchId);

    setMatches((currentMatches) => [...currentMatches, updatedMatch]);
  }

  // not used
  function addAwayTeam(matchId, metadataObj) {
    const match = matches.find((value) => Object.keys(value)[0] === matchId);

    let updatedMatch = {
      [matchId]: {
        ...match.matchId,
        awayteam: {
          team: metadataObj.team,
          starting11: metadataObj.starting,
          sub: metadataObj.sub,
          coach: metadataObj.coach,
        },
      },
    };

    removeMatch(matchId);

    setMatches((currentMatches) => [...currentMatches, updatedMatch]);
  }

  // not used
  function setdidHaveExtraTime(matchId, bool) {
    const match = matches.find((value) => Object.keys(value)[0] === matchId);

    let updatedMatch = {
      [matchId]: {
        ...match.matchId,
        extratime: bool === "true",
      },
    };

    removeMatch(matchId);

    setMatches((currentMatches) => [...currentMatches, updatedMatch]);
  }

  function addEvent(matchId, metadataObj) {
    console.log("Im trying to add event");
  }

  const value = {
    matches,
    syncMatches,
    addMatchDetails,
    removeMatch,
    addHomeTeam,
    addAwayTeam,
    setdidHaveExtraTime,
    addEvent,
  };

  return (
    <AppContext.Provider value={value}>
      <NextProgress color="red" />
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}
