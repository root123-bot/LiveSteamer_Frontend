import NavBar from "../components/Navbar";
import styles from "../static/css/assets.module.css";
import AssetItem from "../components/AssetItem";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useContext,
} from "react";
import Title from "../components/Header";
import TopSection from "../components/TopSection";
import AssetCard from "../components/AssetCard";
import { useRouter } from "next/router";
import { API_URL } from "../globals/domain";
import { Loader } from "semantic-ui-react";
import { AppContext } from "../store/AppContext";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";

let bc = new BroadcastChannel("MatchContextBroadcast");

function Assets() {
  const [comp, setComp] = useState();
  const [timu, setTimu] = useState();
  const [ven, setVen] = useState();
  const [pla, setPla] = useState();
  const [needsContext, setNeedContext] = useState(0);

  const compRef = useRef();
  const teamRef = useRef();
  const venueRef = useRef();
  const playerRef = useRef();

  const cPage = useRef();
  const tPage = useRef();
  const vPage = useRef();
  const pPage = useRef();
  const router = useRouter();

  const MatchContext = useContext(AppContext);

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
        console.log("i receive a new match to add in my context ", data.new);
        MatchContext.addMatchDetails(data.new, data.metadataObj);
      }
    };
  }, []);

  useEffect(() => {
    if (needsContext) {
      // hey just send what context data you have...
      // MatchContext.matches.length > 0 &&
      //   bc.postMessage({ matches: MatchContext.matches });
      {
        /* IMENILAZIMU KU-STORE CONTEXT IN VARIALBE COZ BILA KUFANYA HIVI
          HII CONTEXT INA-RETURN [] EVERYTIME EVEN IF THERE IS MATCHES CONTEXT
          I DON'T KNOW WHAT HAPPEN BUT THAT'S WHAT IT NEED ME TO DO. */
      }
      const matches = MatchContext.matches;

      matches.length > 0 && bc.postMessage({ matches });
    }
  }, [needsContext]);
  {
    /* useLayoutEffect is only made to run on the client Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.
        so when the server try to render it sometimes it gives us warning .. So to avoid this because the useLayoutEffect and the 
        useEffect are somehow identical let's use condition if we've 'window' object it means we're in 'client' to use useLayout...
        https://eight-bites.blog/en/2021/05/uselayouteffect-ssr/ https://github.com/react-component/overflow/issues/6
        https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server */
  }

  const useIsomorphicEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;
  useIsomorphicEffect(() => {
    {
      /*
         our query is in 'active' key of the 'query' object.. But hii inakua sometimes
         inasumbua mara nyingine inakwambia there is no any parameter in query so ya uhakika
         hapa ni kutumia 'asPath' ambayo tuliitumia in our component 'competition' to alter the
         path of next page.. view on competition utaiona hii ndo 'asPath' ndo inakuwa na full url
         ambayo tunaitaka sisi na huwa haina gadagada kabisa haisubui.. ko kama unavyojua in 'url' 
         object kuna query object ambayo unafanya ...router.query ...  but hii query sio ya uhakika
         yaani inakua inasumbua..
        */
    }
    const active = parseInt(
      router.asPath.substring(router.asPath.indexOf("=") + 1)
    );
    // 1 == 'competition', 2 == 'team', 3 == 'venue', 4 == 'player'
    switch (parseInt(active)) {
      case 1:
        teamRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";
        compRef.current.style.color = "rgb(80, 80, 80)";

        cPage.current.style.display = "block";
        tPage.current.style.display = "none";
        vPage.current.style.display = "none";
        pPage.current.style.display = "none";

        // lets fetch all the contents of the competition and assign them here

        break;
      case 2:
        compRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";
        teamRef.current.style.color = "rgb(80, 80, 80)";

        cPage.current.style.display = "none";
        tPage.current.style.display = "block";
        vPage.current.style.display = "none";
        pPage.current.style.display = "none";
        // lets fetch all the contents of the competition and assign them here

        break;
      case 3:
        teamRef.current.style.color = "rgb(150, 150, 150)";
        compRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(80, 80, 80)";

        cPage.current.style.display = "none";
        tPage.current.style.display = "none";
        vPage.current.style.display = "block";
        pPage.current.style.display = "none";

        break;
      case 4:
        teamRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        compRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(80, 80, 80)";

        cPage.current.style.display = "none";
        tPage.current.style.display = "none";
        vPage.current.style.display = "none";
        pPage.current.style.display = "block";

        break;
      default:
        // the default one is with 'Competition' active..
        teamRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";
        compRef.current.style.color = "rgb(80, 80, 80)";

        cPage.current.style.display = "block";
        tPage.current.style.display = "none";
        vPage.current.style.display = "none";
        pPage.current.style.display = "none";
    }

    // fetch some data to populate... advantage of this it fetch the data only once when
    // component is mounted..
    fetch(`${API_URL}/api/competitions/`)
      .then((response) => response.json())
      .then((json) => {
        setComp(json.reverse());
      });

    fetch(`${API_URL}/api/teams/`)
      .then((response) => response.json())
      .then((json) => {
        setTimu(json.reverse());
      });

    fetch(`${API_URL}/api/venues/`)
      .then((response) => response.json())
      .then((json) => {
        setVen(json.reverse());
      });

    fetch(`${API_URL}/api/players/`)
      .then((response) => response.json())
      .then((json) => {
        setPla(json.reverse());
      });
  }, []);

  function activated(refInstance, id) {
    // so what happen here first i will convert the required ref to 'active' color
    // then I disable others to not be active...
    refInstance.current.style.color = "rgb(80, 80, 80)";

    switch (parseInt(id)) {
      case 1:
        teamRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";

        cPage.current.style.display = "block";
        tPage.current.style.display = "none";
        vPage.current.style.display = "none";
        pPage.current.style.display = "none";
        break;
      case 2:
        compRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";

        cPage.current.style.display = "none";
        tPage.current.style.display = "block";
        vPage.current.style.display = "none";
        pPage.current.style.display = "none";
        break;
      case 3:
        teamRef.current.style.color = "rgb(150, 150, 150)";
        compRef.current.style.color = "rgb(150, 150, 150)";
        playerRef.current.style.color = "rgb(150, 150, 150)";

        cPage.current.style.display = "none";
        tPage.current.style.display = "none";
        vPage.current.style.display = "block";
        pPage.current.style.display = "none";
        break;
      case 4:
        teamRef.current.style.color = "rgb(150, 150, 150)";
        venueRef.current.style.color = "rgb(150, 150, 150)";
        compRef.current.style.color = "rgb(150, 150, 150)";

        cPage.current.style.display = "none";
        tPage.current.style.display = "none";
        vPage.current.style.display = "none";
        pPage.current.style.display = "block";
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <NavBar />
      <div className={styles.sec}>
        <div className={styles.col1}>
          <p className={styles.head}> MANAGE ASSETS </p>
          <div>
            <div
              ref={compRef}
              className={styles.toTrack1}
              onClick={activated.bind(this, compRef, 1)}
            >
              <AssetItem title="Competition" />
            </div>
            <div
              ref={teamRef}
              className={styles.toTrack}
              onClick={activated.bind(this, teamRef, 2)}
            >
              <AssetItem title="Team/Club" />
            </div>
            <div
              ref={venueRef}
              className={styles.toTrack}
              onClick={activated.bind(this, venueRef, 3)}
            >
              <AssetItem title="Venue/Stadium" />
            </div>
            <div
              ref={playerRef}
              className={styles.toTrack}
              onClick={activated.bind(this, playerRef, 4)}
            >
              <AssetItem title="Player" />
            </div>
          </div>
        </div>
        <div className={styles.col2}>
          <div ref={cPage} className={styles.page1}>
            <Title title="COMPETITIONS" />
            <hr />
            <div className={styles.content}>
              <TopSection title="Competition" />
              <div className={styles.cardWrapper}>
                {/* we should have some thing loading if 
                    the {comp} state is undefined.. Because undefined is assigned
                    as initial state when we don't fetch anything from our
                    backend ... Au niweke something like skeleton... 
                    to show loading...
                     */}
                {!comp ? (
                  <Loader active>loading</Loader>
                ) : comp.length < 1 ? (
                  <p className={styles.none}>
                    Hey currently there is no any competition
                  </p>
                ) : (
                  comp.map((value, index) => (
                    <AssetCard
                      key={index}
                      logo={value.logo}
                      title={value.name}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div ref={tPage} className={styles.page}>
            <Title title="ALL CLUBS & TEAMS" />
            <hr />
            <div className={styles.content}>
              <TopSection title="Team" />
              <div className={styles.cardWrapper}>
                {!timu ? (
                  <Loader active>loading</Loader>
                ) : timu.length < 1 ? (
                  <p className={styles.none}>
                    Hey currently there is no any team/club registered
                  </p>
                ) : (
                  timu.map((value, index) => (
                    <AssetCard
                      key={index}
                      logo={value.logo}
                      title={value.name}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div ref={vPage} className={styles.page}>
            <Title title="VENUES/STADIUMS" />
            <hr />
            <div className={styles.content}>
              <TopSection title="Stadium" />
              <div className={styles.cardWrapper}>
                {!ven ? (
                  <Loader active>loading</Loader>
                ) : ven.length < 1 ? (
                  <p className={styles.none}>
                    Hey currently there is no any stadium registered.
                  </p>
                ) : (
                  ven.map((value, index) => (
                    <AssetCard
                      key={index}
                      logo="../static/images/kiwanja.png"
                      title={value.name}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div ref={pPage} className={styles.page}>
            <Title title="PLAYERS" />
            <hr />
            <div className={styles.content}>
              {/* testing if we can open the new tab and still having our 'context data in that page' 
              <Link href="/player" target="_blank">
                Navigate to Players to test Context
              </Link>
              */}
              <TopSection title="Player" />
              <div className={styles.cardWrapper}>
                {!pla ? (
                  <Loader active>loading</Loader>
                ) : pla.length < 1 ? (
                  <p className={styles.none}>
                    Hey currently there is no any player registered
                  </p>
                ) : (
                  pla.map((value, index) => (
                    <AssetCard
                      key={index}
                      logo={
                        value.photo.includes("undefined")
                          ? "../static/images/anonymous.png"
                          : value.photo
                      }
                      title={value.first_name}
                      lname={value.last_name}
                      height={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* hapa ni kwamba hatutaki body i-scroll point yetu ni kwamba tunataka only div fulani ambayo ipo kwenye body ndo i-scroll na kwa hapa tume-win
                    hapa point yangu hatutaki tuwe na scroll-bar mbili/zaid ya moja ... tunataka only a div containing the preview of sidebar to be scrolled if the 
                    content exceed the specified width.... */}
        <style jsx global>{`
          body {
            overflow-y: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}

export default Assets;
