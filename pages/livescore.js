import { useEffect } from "react";
import { useCtx } from "../store/AppContext";
import TeamsAnimation from "../components/animations/break/teams";
import { EVENT_TYPE } from "../constants";

let bc = new BroadcastChannel("MatchContextBroadcast");

function LiveScorePage() {
  const { matchEvents, addMatchEvent } = useCtx();

  useEffect(() => {
    bc.onmessage = ({ data }) => {
      if (data === "Sync me!") {
        console.log("HELLO");
      }

      if (data.message.toLowerCase() === "Trigger event".toLowerCase()) {
        // save it to our context
        addMatchEvent(data.event);
      }
    };
  });

  const checkVisible = (eventName) => {
    if (matchEvents) {
        const lastEvent = matchEvents[matchEvents.length - 1]
        console.log('LAST EVENT ', lastEvent)

        if (lastEvent?.name === eventName) {
            console.log("IS VISIBLE")
            return true
        }

        else {
            console.log("IM OUTSIDE NOT CONDITION FAILED")
            return
        }
    }
    return;
  }

  checkVisible("INTRO")

  console.log(matchEvents)
  return (
    <div>
      <TeamsAnimation
        // isVisible={
        //   matchEvents
        //     ? matchEvents[matchEvents.length - 1].name === EVENT_TYPE.INTRO
        //     : false
        // }
        isVisible={checkVisible(EVENT_TYPE.INTRO)}
        // isVisible
      />
    </div>
  );
}

export default LiveScorePage;
