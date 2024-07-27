let bc = new BroadcastChannel("MatchContextBroadcast");
import { useContext } from "react";
import { EVENT_TYPE } from "../constants";
import { AppContext } from "../store/AppContext";

function EventPage() {
//   const { addMatchEvent } = useCtx();

  const { addMatchEvent } = useContext(AppContext);

  const handleStartMatch = () => {
    const event = {
      name: EVENT_TYPE.INTRO,
    };

    addMatchEvent(event);

    bc.postMessage({
        message: "Trigger event",
        event: event
    });
  };
  
  const handleShowTeams = () => {
    const event = {
        name: EVENT_TYPE.START_MATCH
    }

    addMatchEvent(event)
  }

  const handleShowGoal = () => {
    const event = {
        name: EVENT_TYPE.NORMAL_GOAL
    }
    
    addMatchEvent(event)
  }

  return (
    <div>
      <p>I'm the events page</p>
      <button onClick={handleStartMatch}>Show Intro</button>
      <br />
      <br />
      <br />
      <button onClick={handleShowTeams}>Start Match</button>
      <br />
      <br />
      <br />
      <button onClick={handleShowGoal}>Show Goal</button>
    </div>
  );
}

export default EventPage;
