import NavBar from "../components/Navbar";
import BehaveLikeCard from "../components/Card";
import styles from "../static/css/index.module.css";
import { Grid, Icon } from "semantic-ui-react";
import Pointer from "../components/Pointer";
import { Button } from "semantic-ui-react";
import { API_URL } from "../globals/domain";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/AppContext";
import Match from "../components/Match";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";
import { Loader } from "semantic-ui-react";
import { sortCtxByCreatedAt } from "../utils/sortByCreatedAt";

let bc = new BroadcastChannel("MatchContextBroadcast");

{
  /*THIS IS ON HOW TO DO SERVER SIDE RENDERING JUST LIKE YOU DID IN
    CLASS BASED COMPONENTS AND THIS IS HOW TO DO IT IN FUNCTION BASED..
    ALL IN ALL THIS DATA SERVERD IN PROPS..
 https://www.youtube.com/watch?v=zueyEdRZQlk
 https://nextjs.org/docs/basic-features/data-fetching/get-static-props
*/
}
export async function getStaticProps() {
  const response = await fetch(`${API_URL}/api/competitions/`);
  const data = await response.json();
  const totalComp = data.length;
  const response2 = await fetch(`${API_URL}/api/teams/`);
  const data2 = await response2.json();
  const totalTeams = data2.length;
  const response3 = await fetch(`${API_URL}/api/venues/`);
  const data3 = await response3.json();
  const totalVenues = data3.length;
  const response4 = await fetch(`${API_URL}/api/players/`);
  const data4 = await response4.json();
  const totalPlayers = data4.length;

  return { props: { totalComp, totalPlayers, totalTeams, totalVenues } };
}

function Testing({ totalComp, totalPlayers, totalTeams, totalVenues }) {
  const [needsContext, setNeedContext] = useState(0);
  const [FetchedMatchesDB, setFetchedMatchesFromDB] = useState([]);
  const [totalData, setTotalData] = useState();
  const [availableCtx, setAvailableCtx] = useState();
  const MatchContext = useContext(AppContext);

  // i need the useEffect to clear all duplicates from our context when the component mount because after we add team we're redirected here..

  useEffect(() => console.log("total data ", totalData), [totalData]);

  // i need to check if the 'context' is changed to update teamData
  useEffect(() => {
    const ctx = [...MatchContext.matches];
    console.log("Im detecting changes in context ", ctx);
    for (let item of ctx) {
      console.log("element ", item);
    }

    let fetchedMatchesIDs = [];
    for (let match of FetchedMatchesDB) {
      fetchedMatchesIDs.push(Object.values(match)[5]);
    }
    fetchedMatchesIDs = [...new Set(fetchedMatchesIDs)];
    // no duplicatesCtx() helper function failed to remove the duplicated data instead it remove good one
    const noDupCtx = noDuplicatesCtx(ctx);
    console.log("No dupli ctx ", noDupCtx, fetchedMatchesIDs);
    const matchesCopy = [...noDupCtx];
    let ctxIDS = [];
    for (let id of matchesCopy) {
      ctxIDS.push(Object.keys(id)[0]);
    }
    ctxIDS = [...new Set(ctxIDS)]; // remove duplicate from arr-plain array
    console.log("in ctx ids ", ctxIDS, " from DB ids ", fetchedMatchesIDs);
    for (let fetchedId of fetchedMatchesIDs) {
      if (!ctxIDS.includes(fetchedId)) {
        console.log("im inside one ", fetchedId);
        matchesCopy.push({
          [fetchedId]: {
            createdAt: FetchedMatchesDB.find(
              (value) => value.matchId === fetchedId
            ).addedAt,
            stadium: FetchedMatchesDB.find(
              (value) => value.matchId === fetchedId
            ).stadium,
          },
        });
      } else {
        continue;
      }
    }

    const noDuplicate = noDuplicatesCtx(matchesCopy);
    MatchContext.syncMatches(noDuplicate);
    const noDuplicatedCopy = [...noDuplicate];
    const tData = sortCtxByCreatedAt(noDuplicatedCopy);
    setTotalData(tData); // noDuplicate
  }, [MatchContext.matches.length, FetchedMatchesDB]); // kama na fetchedMatchesDB itasumbua weka fetchedMatchesDB.length

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
    {
      /* this will not work perfect b-coz if the 'index' page if first rendered it 
        will not have the 'context' because if need to 'receive' the context after 
        broadcast and remember the process of receiving the 'context' is async so 
        initially this will read [] for first rendered page, so i think it best 
        practise to put in inside the 'data.matches' listener handler b'coz that's 
        when the page receive the 'context... */
    }

    {
      /* also initially when the component mounted in 'index.js' since i have the list of matches
        I need to fetch match which are incomplete from the 'db' but i should also 'detect' if there 
       is a matches in context with those ids i need to re-place them re-rendered from the db since db
       does not have matches with metadata they only consists matches ids no metadata so i need
       to replace them with the same ids in listener of data.matches...
        */
    }
    // at first time ikianza inaanzia hapa na ujue hii inaenda kusoma
    // context as []... ko unahisi sio sawa kuiweka hii logic hapa juu
    // coz ina-override hadi context yenye data..

    fetch(`${API_URL}/api/matches/`)
      .then((response) => response.json())
      .then((matches) => {
        console.log("matches from DB ", matches);
        setFetchedMatchesFromDB(matches);
        {
          /* 
            // const fetchedMatchesIDs = [];
            // for (let match of matches) {
            //   fetchedMatchesIDs.push(Object.values(match)[5]);
            // }
            // let mCtx = [...MatchContext.matches];

            // const noDupCtx = noDuplicatesCtx(mCtx);
            // console.log("Context data b4 that not in listener", noDupCtx);
            // const matchesCopy = [...noDupCtx];
            // for (let fetchedId of fetchedMatchesIDs) {
            //   if (!matchesCopy.includes(fetchedId)) {
            //     matchesCopy.push({ [fetchedId]: {} });
            //   } else {
            //     continue;
            //   }
            // }
            // console.log("This is matches copy for you!!!! ", matchesCopy);

            // const noDuplicate = noDuplicatesCtx(matchesCopy);
            // MatchContext.syncMatches(noDuplicate);
            // setTotalData(noDuplicate);
        */
        }
      })
      .catch((err) => console.log("error occured ", err));

    bc.postMessage("Sync me!");

    bc.onmessage = ({ data }) => {
      if (data === "Sync me!") {
        setNeedContext((prevState) => prevState + 1);
      }
      if (data.matches) {
        const matches = [...data.matches];
        const noDupCtx = noDuplicatesCtx(matches);

        let fetchedMatchesIDs = [];
        for (let match of FetchedMatchesDB) {
          fetchedMatchesIDs.push(Object.values(match)[5]);
        }
        fetchedMatchesIDs = [...new Set(fetchedMatchesIDs)];

        const matchesCopy = [...noDupCtx];
        let ctxIDS = [];
        for (let id of matchesCopy) {
          ctxIDS.push(Object.keys(id)[0]);
        }
        ctxIDS = [...new Set(ctxIDS)]; // remove duplicated from arr
        console.log("Context data b4 in LISTENER ", noDupCtx);
        console.log("in ctx ids ", ctxIDS, " from DB ids ", fetchedMatchesIDs);

        for (let fetchedId of fetchedMatchesIDs) {
          if (!ctxIDS.includes(fetchedId)) {
            console.log("im inside many ", fetchedId);
            matchesCopy.push({
              [fetchedId]: {
                createdAt: FetchedMatchesDB.find(
                  (value) => value.matchId === fetchedId
                ).addedAt,
                stadium: FetchedMatchesDB.find(
                  (value) => value.matchId === fetchedId
                ).stadium,
              },
            });
          } else {
            continue;
          }
        }
        console.log("This is matches copy for you! ", matchesCopy);

        const noDuplicate = noDuplicatesCtx(matchesCopy);
        MatchContext.syncMatches(noDuplicate);
        const noDuplicatedCopy = [...noDuplicate];
        const tData = sortCtxByCreatedAt(noDuplicatedCopy);
        setTotalData(tData); // noDuplicate
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
      <div className={styles.sec}>
        <Grid>
          <Grid.Column width={12}>
            <div className={styles.putVl}>
              <img src="../static/images/spider.gif" width={70} height={70} />
              <span className={styles.sp}>Hi, Welcome Back!</span>

              <hr className={styles.hl} />
              <p className={styles.minHead}>Summary</p>
              <div className={styles.inl}>
                <BehaveLikeCard
                  title="Competition"
                  logo="../static/images/trophy.png"
                  number={totalComp}
                  iconName="trophy"
                />
                <BehaveLikeCard
                  title="Teams/Clubs"
                  logo="../static/images/football-club.png"
                  number={totalTeams}
                  iconName="group"
                />
                <BehaveLikeCard
                  title="Venues/Stadiums"
                  logo="../static/images/stadium.png"
                  number={totalVenues}
                  iconName="arrow right"
                />
                {/* <BehaveLikeCard title='Players' logo='../static/images/football-player.png' number={91} /> */}
                <BehaveLikeCard
                  title="Player"
                  logo="../static/images/football-player.png"
                  number={totalPlayers}
                  iconName="star"
                />
              </div>
            </div>
          </Grid.Column>

          <Grid.Column width={4}>
            <div>
              <p className={styles.ms}>Match Statistics</p>
              <Pointer text="Total Matches" value={20} />
              <Pointer text="Completed Matches" value={20} />
              <Pointer text="Current playing match" value={0} />
            </div>
            {/* hii sometimes matchesfromDB initially kama inakuwa 'undefined' but i thinks since we update state which is async... this 
            bring the error when you refresh the page when it update from the DB.. */}
            <div className={styles.secDiv}>
              <p className={styles.topHead}>Upcoming Matches</p>
              {totalData &&
                totalData.filter(
                  (val) => val[Object.keys(val)[0]].hometeam === undefined
                ).length > 0 && (
                  <div className={styles.hintContainer}>
                    <Icon name="warning circle" color="red" />{" "}
                    <span className={styles.hint}>
                      means no match metadata set for given match!
                    </span>
                  </div>
                )}
              <div className={styles.roundIt}>
                {!totalData ? (
                  <div
                    style={{
                      height: "60px",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Loader inline active>
                      fetching...
                    </Loader>
                  </div>
                ) : totalData.length < 1 ? (
                  <p className={styles.noMatch}>No match scheduled!</p>
                ) : FetchedMatchesDB.length > 0 ? (
                  totalData.map((val, index) => (
                    <div
                      key={index}
                      onClick={() => console.log("He clicked the match..")}
                    >
                      <Match
                        homeLogo={
                          val[Object.keys(val)[0]].hometeam
                            ? val[Object.keys(val)[0]].hometeam.xtraMetadata
                                .image.src
                            : `${API_URL}${
                                FetchedMatchesDB.find(
                                  (value) =>
                                    value.matchId === Object.keys(val)[0]
                                ).hteamlogo
                              }
                          `
                        }
                        awayLogo={
                          val[Object.keys(val)[0]].awayteam
                            ? val[Object.keys(val)[0]].awayteam.xtraMetadata
                                .image.src
                            : `${API_URL}${
                                FetchedMatchesDB.find(
                                  (value) =>
                                    value.matchId === Object.keys(val)[0]
                                ).ateamlogo
                              }
                            `
                        }
                        home={
                          val[Object.keys(val)[0]].hometeam
                            ? val[
                                Object.keys(val)[0]
                              ].hometeam.xtraMetadata.text.substr(0, 10) + ".."
                            : FetchedMatchesDB.find(
                                (value) => value.matchId === Object.keys(val)[0]
                              ).hteamname.substr(0, 11) + ".."
                        }
                        away={
                          val[Object.keys(val)[0]].awayteam
                            ? val[
                                Object.keys(val)[0]
                              ].awayteam.xtraMetadata.text.substr(0, 10) + ".."
                            : FetchedMatchesDB.find(
                                (value) => value.matchId === Object.keys(val)[0]
                              ).ateamname.substr(0, 11) + ".."
                        }
                        stadium={
                          val[Object.keys(val)[0]].stadium.substr(0, 25) + ".."
                        }
                        warning={
                          !val[Object.keys(val)[0]].hometeam ? true : false
                        }
                      />
                      <br />
                    </div>
                  ))
                ) : (
                  totalData.map((val, index) => (
                    <div
                      key={index}
                      onClick={() => console.log("He clicked the match..")}
                    >
                      <Match
                        homeLogo={
                          val[Object.keys(val)[0]].hometeam
                            ? val[Object.keys(val)[0]].hometeam.xtraMetadata
                                .image.src
                            : ""
                        }
                        awayLogo={
                          val[Object.keys(val)[0]].awayteam
                            ? val[Object.keys(val)[0]].awayteam.xtraMetadata
                                .image.src
                            : ""
                        }
                        home={
                          val[Object.keys(val)[0]].hometeam
                            ? val[
                                Object.keys(val)[0]
                              ].hometeam.xtraMetadata.text.substr(0, 10) + ".."
                            : ""
                        }
                        away={
                          val[Object.keys(val)[0]].awayteam
                            ? val[
                                Object.keys(val)[0]
                              ].awayteam.xtraMetadata.text.substr(0, 10) + ".."
                            : ""
                        }
                        stadium={
                          val[Object.keys(val)[0]].stadium.substr(0, 25) + ".."
                        }
                        warning={
                          !val[Object.keys(val)[0]].hometeam ? true : false
                        }
                      />
                      {/* if we loaded from DB val[obj.keys(val)[0]].team is 'undefined' so this will be 'false'
                      if its false we should 'make' it true using ! and send 'true' value to display warning */}
                      <br />
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.blwDiv}>
              <Button content="Create Match" icon="plus" fluid />
            </div>
          </Grid.Column>
        </Grid>
      </div>
    </div>
  );
}

export default Testing;
