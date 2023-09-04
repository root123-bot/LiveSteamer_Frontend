import NavBar from "../components/Navbar";
import { AppContext } from "../store/AppContext";
import { useContext } from "react";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";
let bc = new BroadcastChannel("MatchContextBroadcast");

function Theme() {
  const MatchContext = useContext(AppContext);
  const [needsContext, setNeedContext] = useState(0);

  {
    /* hii nimeiweka hapa imefanya vizuri ime-send all available context to others nimetest kui-weka in _app.js
          ikawa inakataa ikawa inasend empty array but here imekaa sawa...
          if you receive sync message then you need to send available 'matches' in context to all subscribers....
          so if someone want to be updated after reload/refresh he should send this message...
          we need to reply available matches.. you should add this useEffect in all pages for it to work perfectly
          and the easy way is using _app.js but app.js context matches return [] empty array so that's why we need to 
          add this manually to all pages... other message i added them to _app.js since they work perfectly */
  }
  useEffect(() => {
    bc.postMessage("Sync me!");

    bc.onmessage = ({ data }) => {
      if (data === "Sync me!") {
        {
          /* why i didn't send the 'context' matches inside this
            useEffect listener, the reason behind is that if we 
            try to send inside here at the time this listener is 
            registered in useEffect on mounting often the 'Context'
            is [] let say we did
                  >>> const matches = MatchContext.matches 
                  >>> bc.postMessage({matches})
            at the time of registering the 'listener' the context matches
            is [] this VALUE IS KEPT THROUGHOUT THE LIFECYLE OF APP BECAUSE 
            WE REGISTERED THIS LISTENER ONLY AT ONCE WHEN COMPONENT MOUNTED
            SO HERE WE FAILS NDO MAANA NILIKUA NAONA KILA NINAPOSEND 'CONTEXT'
            KWA NJIA HII EVEN IF I HAVE CONTEXT MATCHES I ALWAYS SEND '[]'
            THE REASON BEHIND IS THAT.. SO WE NEED ANOTHER MECHANISM WHERE HERE
            WHAT I DID IS CREATE A WATCHDOG/FLAG USING USEEFFECT WHICH IS 
            'needContext' USESTATE THIS STATE WILL INCREMENT BY ONE EVERYTIME THE 
            PAGE/COMPONENT WANT TO 'BROADCAST' AVAILABLE 'CONTEXT' AND THEN I 
            CREATED A 'USEEFFECT' TO WATCH EVERYTIME WHEN 'needContext' CHANGE WHEN
            IT CHANGE WE SEND THE CONTEXT AND BY DOING THAT MEANS THIS USEEFFECT WILL
            RUN EVERYTIME AND IT WILL NOT CONTAIN ONE HARDCODED VALUE LIKE WE HAVE 
            WHEN WE SEND/BROADCAST CONTEXT INSIDE THIS USEEFFECT CONTAING THE LISTENER
            SO THIS IS WHAT I DID AND ACHIEVE AND I THINK THIS KIND OF SCENARIO OCCURS 
            ALMOST TO ALL LISTENER BECAUSE THEY COME WITH HARDCODED VALUES IN VARIABLE SINCE
            WHEN LISTENER IS REGISTERED IT GET REGISTERED WITH THAT VALUE.. ALSO JUST CHECK
            ABOVE I STORE MY CONTEXT VALUE INSIDE THE >> const matches = MatchContext.matches
            I DON'T KNOW WHY REQUIRE ME TO DO THIS BUT I TRY WITHOUT IT TO PASS CONTEXT ON THE FLY
            BUT IT DOES NOT CHANGE IT REMAINS [] THATS WHY IT FORCE ME TO STORE IT IN THE VARIABLE
            I DID THE SAME IN MY USEEFFECT WHICH KEEPS TRACK OF 'needsContext' IN ORDER TO BROADCAST
            THE AVAILABLE CONTEXT... THAT'S ALL BUT KEEP THIS CHALLENGE YOU GET IN YOUR HEAD EVERYTIME
            YOU MEET WITH THAT KIND OF SCENARIO OF LISTENER STORED IN 'USEEFFECT'    
              */
        }
        setNeedContext((prevState) => prevState + 1);
      }
      if (data.matches) {
        console.log("current context ", MatchContext.matches);
        // mara nyingi ili tusi-affect the value of our context lets store our context in given variable
        const matches = [...data.matches];
        const noDupCtx = noDuplicatesCtx(matches);
        MatchContext.syncMatches(noDupCtx);
      }

      if (data.new && data.metadataObj) {
        MatchContext.addMatchDetails(data.new, data.metadataObj);
      }
    };
  }, []);

  useEffect(() => {
    if (needsContext) {
      // hey just send what context data you have...
      // MatchContext.matches.length > 0 &&
      // bc.postMessage({ matches: MatchContext.matches });
      {
        /* IMENILAZIMU KU-STORE CONTEXT IN VARIALBE COZ BILA KUFANYA HIVI
          HII CONTEXT INA-RETURN [] EVERYTIME EVEN IF THERE IS MATCHES CONTEXT
          I DON'T KNOW WHAT HAPPEN BUT THAT'S WHAT IT NEED ME TO DO. */
      }
      const matches = MatchContext.matches;

      matches.length > 0 && bc.postMessage({ matches });
    }
  }, [needsContext]);
  return (
    <div>
      <NavBar />
      Hello im the theme page
    </div>
  );
}

export default Theme;
