import Title from "../components/Header";
import NavBar from "../components/Navbar";
import styles from "../static/css/match.module.css";
import { Button, Dropdown, Icon, Checkbox, Loader } from "semantic-ui-react";
import { useRef, useEffect, useState, useContext } from "react";
import Message from "../components/Message";
import { API_URL } from "../globals/domain";
import Router from "next/router";
import Input from "../components/Input";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import Article from "../components/Article";
import PlayerProfile from "../components/PlayerProfile";
import uniqueArray from "../utils/uniqueArray";
import { AppContext } from "../store/AppContext";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";

let bc = new BroadcastChannel("MatchContextBroadcast");

function broadcastContext(matchId, metadataObj) {
  bc.postMessage({ new: matchId, metadataObj });
}

export async function getStaticProps() {
  const response = await fetch(`${API_URL}/api/competitions/`);
  const compData = await response.json();
  const response2 = await fetch(`${API_URL}/api/teams/`);
  const teamData = await response2.json();
  const response3 = await fetch(`${API_URL}/api/venues/`);
  const venueData = await response3.json();

  const competitions = compData.map((item) => ({
    key: item.name,
    value: item.id,
    text: item.name.length > 27 ? item.name.substr(0, 28) + "..." : item.name,
    image: { src: item.logo },
  }));
  const teams = teamData.map((item) => ({
    key: item.name,
    value: item.id,
    text: item.name.length > 27 ? item.name.substr(0, 28) + "..." : item.name,
    image: { src: item.logo },
  }));

  const venues = venueData.map((item) => ({
    key: item.name,
    value: item.id,
    text: item.name.length > 30 ? item.name.substr(0, 28) + "..." : item.name,
  }));

  return {
    props: {
      competitions,
      teams,
      venues,
      teamData,
      venueData,
    },
  };
}

// window.postMessage("BAD", "*");

function MatchesPage({ competitions, teams, venues, teamData }) {
  const successRef = useRef();
  const errorRef = useRef();
  const messageTimeout = useRef();
  const manageTeamRef = useRef();
  const mainPageRef = useRef();
  const manageTeamErrorRef = useRef();
  const manageTeamErrorTimeout = useRef();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [homeTeam, setHomeTeam] = useState();
  const [competition, setCompetition] = useState();
  const [awayTeam, setAwayTeam] = useState();
  const [pickedVenue, setPickedVenue] = useState();
  const [checked, setChecked] = useState(false);
  const [homeStadium, setHomeStadium] = useState();
  const [matchName, setMatchName] = useState("");
  const [syncLoading, setSyncLoading] = useState();
  const [homePlayers, setHomePlayers] = useState();
  const [awayPlayers, setAwayPlayers] = useState();
  const [shouldSync, setShouldSync] = useState(); // false
  const [homeFirstXI, setHomeFirstXI] = useState([]);
  const [homeSubs, setHomeSubs] = useState([]);
  const [awayFirstXI, setAwayFirstXI] = useState([]);
  const [awaySubs, setAwaySubs] = useState([]);
  const [totalHomeStarterOnSync, setTotalHomeStarterOnSync] = useState([]);
  const [totalAwayStarterOnSync, setTotalAwayStarterOnSync] = useState([]);
  const [ultimateSaveLoading, setUltimateSaveLoading] = useState(false);
  const [manageTeamError, setManageTeamError] = useState("");
  const [needsContext, setNeedContext] = useState(0);
  const [homeExtra, setHomeExtra] = useState();
  const [awayExtra, setAwayExtra] = useState();

  const MatchContext = useContext(AppContext);

  useEffect(() => {
    bc.postMessage("Sync me!");

    bc.onmessage = ({ data }) => {
      if (data === "Sync me!") {
        setNeedContext((prevState) => prevState + 1);
      }
      if (data.matches) {
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
      const matches = MatchContext.matches;

      matches.length > 0 && bc.postMessage({ matches });
    }
  }, [needsContext]);

  useEffect(() => {
    return () => {
      if (messageTimeout.current) {
        clearTimeout(messageTimeout.current);
      }
      if (manageTeamErrorTimeout.current) {
        clearTimeout(manageTeamErrorTimeout.current);
      }
    };
  }, []);

  function updateInput(value) {
    setMatchName(value);
  }

  function onChangeAwayTeam(e, { value }) {
    setAwayTeam(value);
    {
      /* if you hold that id can you go to the list of all teams and pick the right object of that team..
        remember teams is 'options' used in our dropdown so it have 'key' which
        is name of team, value which is 'teamId', text which is name of team and 'image' which
        is object containing 'src' key holding src of our image..
    */
    }
    const fullMetadata = teams.find(
      (val) => parseInt(val.value) === parseInt(value)
    );

    setAwayExtra(fullMetadata);
  }

  function onChangeHomeTeam(e, { value }) {
    setHomeTeam(value);

    {
      /* if you hold that id can you go to the list of all teams and pick the right object of that team..
        remember teams is 'options' used in our dropdown so it have 'key' which
        is name of team, value which is 'teamId', text which is name of team and 'image' which
        is object containing 'src' key holding src of our image..
    */
    }
    const fullMetadata = teams.find(
      (val) => parseInt(val.value) === parseInt(value)
    );

    setHomeExtra(fullMetadata);

    const teamVenueId = teamData.find((item) => item.id === value).get_venueId;
    let matchedVenue = venues.indexOf(
      venues.find((item) => item.value === teamVenueId)
    );

    setHomeStadium(matchedVenue === 0 ? "zeroIndex" : matchedVenue); // Hii state haichange au... Inachange ila ishu ipo kwenye condition uliyoiweka hapo.. coz everytime user change homeStadium now is 'defined' so it will remain the same
    setPickedVenue(teamVenueId);
  }

  function onChangeVenueInHomeTeamEffect(e, { value }) {
    const indexOfPickedVen = venues.indexOf(
      venues.find((item) => item.value === value)
    );
    setHomeStadium(indexOfPickedVen === 0 ? "zeroIndex" : indexOfPickedVen); // Hii state haichange au... Inachange ila ishu ipo kwenye condition uliyoiweka hapo.. coz everytime user change homeStadium now is 'defined' so it will remain the same
    setPickedVenue(value);
  }
  function updateOverallStarterHome() {
    {
      /* since we need to pass the 'array' containing all the ids of starter players
      LETS CONTAINS THE ALL PLAYER WHICH ARE STARTER USING HOMEPLAYERS/AWAYPLAYERS INITIALLY
        AFTER FETCH THE homePlayer, and awayPlayer... */
    }
    setHomeFirstXI(totalHomeStarterOnSync);
  }
  function updateOverallStarterAway() {
    // setStarter(parseInt(totalStarter));
    // since we need to pass the 'array' containing all the ids of starter players
    setAwayFirstXI(totalAwayStarterOnSync);
  }

  function updateHomeStartingXI(playerId, action) {
    if (action === "add") {
      let starter = [playerId];
      setHomeFirstXI((prevState) => {
        let noDuplicates = uniqueArray(prevState, starter);
        return [...prevState, ...noDuplicates];
      });
    } else {
      // then here we need to remove that element from starter
      if (homeFirstXI.includes(playerId)) {
        setHomeFirstXI((prevState) => {
          return prevState.filter((value) => value !== playerId);
        });
      }
    }
  }

  function updateAwayStartingXI(playerId, action) {
    if (action === "add") {
      let starter = [playerId];
      setAwayFirstXI((prevState) => {
        let noDuplicates = uniqueArray(prevState, starter);
        return [...prevState, ...noDuplicates];
      });
    } else {
      if (awayFirstXI.includes(playerId)) {
        setAwayFirstXI((prevState) => {
          return prevState.filter((value) => value !== playerId);
        });
      }
    }
  }

  function updateHomeSubs(playerId, action) {
    if (action === "add") {
      let sub = [playerId];
      setHomeSubs((prev) => {
        let noDuplicates = uniqueArray(prev, sub);
        return [...prev, ...noDuplicates];
      });
    } else {
      if (homeSubs.includes(playerId)) {
        setHomeSubs((prev) => prev.filter((value) => value !== playerId));
      }
    }
  }

  function updateAwaySubs(playerId, action) {
    if (action === "add") {
      let sub = [playerId];
      setAwaySubs((prev) => {
        let noDuplicates = uniqueArray(prev, sub);
        return [...prev, ...noDuplicates];
      });
    } else {
      if (awaySubs.includes(playerId)) {
        setAwaySubs((prev) => prev.filter((value) => value !== playerId));
      }
    }
  }

  function updateOverallSubsHome() {
    setHomeSubs([]);
  }

  function updateOverallSubsAway() {
    setAwaySubs([]);
  }

  async function ultimateSaveMatch() {
    if (ultimateSaveLoading) {
      return;
    }
    setUltimateSaveLoading(true);
    if (homeFirstXI.length !== 11 || awayFirstXI.length !== 11) {
      setManageTeamError("Make sure teams starting eleven is equal to 11");
      manageTeamErrorRef.current.style.opacity = 1;
      manageTeamErrorTimeout.current = setTimeout(() => {
        manageTeamErrorRef.current.style.opacity = 0;
      }, 5000);
      setUltimateSaveLoading(false);
      return;
    }
    if (
      homeSubs.length > 9 ||
      homeSubs.length < 5 ||
      awaySubs.length > 9 ||
      awaySubs.length < 5
    ) {
      setManageTeamError(
        "Make sure total given team subs is less than 10 but starting from 5"
      );
      manageTeamErrorRef.current.style.opacity = 1;
      manageTeamErrorTimeout.current = setTimeout(() => {
        manageTeamErrorRef.current.style.opacity = 0;
      }, 5000);
      setUltimateSaveLoading(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("hteam", homeTeam);
    uploadData.append("ateam", awayTeam);
    uploadData.append("venue", pickedVenue);
    uploadData.append("mname", matchName);
    uploadData.append("etime", checked);
    uploadData.append("competition", competition);

    const response = await fetch(`${API_URL}/api/addMatch/`, {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();
    if (data.error) {
      setManageTeamError(data.error);
      manageTeamErrorRef.current.style.opacity = 1;
      manageTeamErrorTimeout.current = setTimeout(() => {
        manageTeamErrorRef.current.style.opacity = 0;
      }, 5000);
      setUltimateSaveLoading(false);
      return;
    }

    const matchId = data.match;

    const homeres = await fetch(`${API_URL}/api/manager/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: homeTeam,
      }),
    });

    const homedata = await homeres.json();

    const awayres = await fetch(`${API_URL}/api/manager/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        team: awayTeam,
      }),
    });

    const awaydata = await awayres.json();

    console.log(
      "venue name to add in my context ",
      venues.find((val) => parseInt(val.value) === parseInt(pickedVenue)).key
    );

    const metadataObj = {
      hteam: homeTeam,
      hextra: homeExtra,
      ateam: awayTeam,
      aextra: awayExtra,
      hsub: homeSubs,
      asub: awaySubs,
      hstarting: homeFirstXI,
      astarting: awayFirstXI,
      hcoach: homedata.manager,
      acoach: awaydata.manager,
      etime: checked,
      createdAt: Date.now(),
      stadium: venues.find(
        (val) => parseInt(val.value) === parseInt(pickedVenue)
      ).key,
    };

    {
      /* inavyoolekea ikienda kwenye ku-broadcast nayo inajitumia ko haina haja ya mimi update my context...
        sijui kwa nini ila ukiona bado inakusumbua unaweza ukaweka hapa condition to 
        check if object id exist then no need to add a new one.. you can have condition anywhere either here
        or on addMatchDetails in your _app.js, ko tukiweka hapa then ita-add mara mbili instead of one ndo maana
        nika-remove comment hii addMatchDetails() here.. sema bado naona inaji-rudia endapo 
        nitakuwa na object zaidi ya 2 unaona inajirudia sijui kwa nini but SIO MBAYA FOR NOW AT THE END IN ADD EVENT
        EVERYTIME USER TRIES TO ADD EVENT I SHOULD REMOVE ALL DUPLICATES ALSO WHEN WE GO LET'S SAY TO HOME WE SHOULD
        REMOVE DUPLICATES HAUWEZI UKA-FILTER HAPA COZ HII PROCESS YA KU-ADD HIZI OBJECT DUPLICATES INAKUWA NI ASYNC AND
        WE CAN'T TRACK WHEN ONE IS ARLEADY ADDED OR MAYBE I SHOULD ADD THIS CONDITION TO 'AFTER RECEIVING 'SYNC' FLAG IN
        TO FILTER OUT DUPLICATES WE RECEIVED.. */
    }
    // MatchContext.addMatchDetails(matchId, metadataObj);
    broadcastContext(matchId, metadataObj);

    Router.push("/");
    setUltimateSaveLoading(false);
  }

  function onSync() {
    setSyncLoading(true);

    // setShouldSync(true);
    setShouldSync(shouldSync === undefined ? 1 : shouldSync + 1);
    {
      /* don't forget to update is starter... */
    }

    // also we should all players ids which are starter in our firstXI context
    if (homePlayers) {
      // since 'starter' contains either 'true/false' then there is shortcut in filter() no need to put value.starter === true; u can use value.starter only
      const starter = homePlayers
        .filter((value) => value.starter)
        .map((value) => value.id);
      // ubaya wa array it accepts duplicates
      setHomeFirstXI((prevState) => {
        let noDuplicates = uniqueArray(prevState, starter);
        return [...prevState, ...noDuplicates];
      });
    }
    if (awayPlayers) {
      const starter = awayPlayers
        .filter((value) => value.starter)
        .map((value) => value.id);
      setAwayFirstXI((prevState) => {
        let noDuplicates = uniqueArray(prevState, starter);
        return [...prevState, ...noDuplicates];
      });
    }
    setSyncLoading(false);
  }

  function onSave() {
    setLoading(true);
    if (
      !competition ||
      !homeTeam ||
      !awayTeam ||
      !pickedVenue ||
      matchName.trim().length < 1
    ) {
      setError("We don't accept empty fields!");
      errorRef.current.style.display = "block";

      messageTimeout.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 3000);
      setLoading(false);
      return;
    }

    mainPageRef.current.style.display = "none";
    manageTeamRef.current.style.display = "block";
    setLoading(false);

    // All in all you should fetch players belong to given team..
    fetch(`${API_URL}/api/teamPlayers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: parseInt(homeTeam),
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setHomePlayers(json);
        const homeStarter = json
          .filter((value) => value.starter)
          .map((item) => parseInt(item.id));
        setTotalHomeStarterOnSync(homeStarter);
      });

    fetch(`${API_URL}/api/teamPlayers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: parseInt(awayTeam),
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setAwayPlayers(json);
        const awayStarter = json
          .filter((value) => value.starter)
          .map((item) => parseInt(item.id));
        setTotalAwayStarterOnSync(awayStarter);
      });
  }

  return (
    <div>
      <NavBar whatToToggle="match" />
      <div className={styles.container}>
        <div ref={mainPageRef}>
          <Title title="Match" optionTitle="Create" />
          <hr />
          <Button
            content="Save match"
            icon="save outline"
            className={styles.sma}
            onClick={onSave}
            loading={loading}
          />
          <div className={styles.error} ref={errorRef}>
            <Icon name="warning" color="red" />
            {error}
          </div>
          <div className={styles.success} ref={successRef}>
            <Message content="Match has been created successful." />
          </div>
          <div className={styles.inputContainer}>
            <div style={{ marginRight: "60px" }}>
              <label className={styles.lab}>Select competition:</label>
              <br />
              <div style={{ width: "300px" }}>
                <Dropdown
                  placeholder="type sth..."
                  fluid
                  search
                  selection
                  options={competitions}
                  onChange={(e, { value }) => setCompetition(value)}
                />
                <small
                  onClick={() =>
                    Router.push({
                      pathname: "/competition",
                      query: { next: "match" },
                    })
                  }
                  className={styles.sm}
                >
                  Create new competition
                </small>
              </div>
            </div>
            <div style={{ marginRight: "60px" }}>
              <label className={styles.lab}>Home Team:</label>
              <br />
              <div style={{ width: "300px" }}>
                <Dropdown
                  placeholder="type sth..."
                  fluid
                  search
                  selection
                  options={teams}
                  onChange={onChangeHomeTeam}
                />
                <small
                  onClick={() =>
                    Router.push({
                      pathname: "/team",
                      query: { next: "match" },
                    })
                  }
                  className={styles.sm}
                >
                  Create new team
                </small>
              </div>
            </div>
            <div style={{ marginRight: "60px" }}>
              <label className={styles.lab}>Away Team:</label>
              <br />
              <div style={{ width: "300px" }}>
                <Dropdown
                  placeholder="type sth..."
                  fluid
                  search
                  selection
                  options={teams}
                  onChange={onChangeAwayTeam}
                />
                <small
                  onClick={() =>
                    Router.push({
                      pathname: "/team",
                      query: { next: "match" },
                    })
                  }
                  className={styles.sm}
                >
                  Create new team
                </small>
              </div>
            </div>
          </div>
          <div className={styles.inputContainer1}>
            <div style={{ marginRight: "60px" }}>
              <label className={styles.lab}>Pick stadium:</label>
              <br />
              <div style={{ width: "300px" }}>
                {/* ubaya wa hii inaweza ikaenda kwenye 'undefined'.. ko weka condition hapo.. Pia nimetumi
                  tumetumia 'zeroIndex' on assigning homeStadium state if index is zero because
                  our condition below here check for 'existence' of index of the homeStadium.. ko
                  if we 'have' and set homeStadium to 'index' of '0' then when it goes and check
                  this condition it will be counted as 'undefined' since 0 in programming is 'false'..
                  Ko that's why on setting 'homeStadium' if index of zero we 'assigned' string of 
                  'zeroIndex' which then come to be checked below and assign the actual index which is
                  0..  */}
                {homeStadium ? (
                  <Dropdown
                    options={venues}
                    placeholder="type sth..."
                    fluid
                    search
                    value={
                      homeStadium === "zeroIndex"
                        ? venues[0].value
                        : venues[homeStadium].value
                    }
                    selection
                    onChange={onChangeVenueInHomeTeamEffect}
                  />
                ) : (
                  <Dropdown
                    options={venues}
                    placeholder="type sth..."
                    fluid
                    search
                    selection
                    onChange={(e, { value }) => setPickedVenue(value)}
                  />
                )}
                <small
                  onClick={() =>
                    Router.push({
                      pathname: "/stadium",
                      query: { next: "match" },
                    })
                  }
                  className={styles.sm}
                >
                  Create new stadium
                </small>
              </div>
            </div>
            <Input
              label="Match name"
              style={{ paddingRight: "60px" }}
              save={updateInput}
            />
            <div>
              <label className={styles.lab}>Extra time?</label>
              <br />
              <Checkbox
                onChange={(e, { checked }) => setChecked(checked)}
                toggle
              />
            </div>
          </div>
        </div>
        <div
          className={styles.popup}
          ref={manageTeamRef}
          // style={{ overflowY: "hidden" }}
        >
          <div className={styles.parentContainer}>
            <div className={styles.popupContainer}>
              <Title title="Squads" optionTitle="Manage" style={style} />
              <div className={styles.parentDashboardContainer}>
                <p className={styles.comp}>
                  {competition &&
                    competitions.find((item) => item.value === competition)
                      .text}
                </p>
                <div className={styles.dashHolder}>
                  <img
                    src={
                      homeTeam &&
                      teamData &&
                      teamData.find((item) => item.id === homeTeam).logo
                    }
                    width={30}
                  />
                  <span className={styles.t1}>
                    {homeTeam &&
                      teamData &&
                      teamData.find((item) => item.id === homeTeam).short_name}
                  </span>
                  <span className={styles.vs}>VS</span>
                  <span className={styles.t2}>
                    {awayTeam &&
                      teamData &&
                      teamData.find((item) => item.id === awayTeam).short_name}
                  </span>

                  <img
                    src={
                      awayTeam &&
                      teamData &&
                      teamData.find((item) => item.id === awayTeam).logo
                    }
                    width={30}
                  />
                </div>
              </div>
              <div style={{ marginRight: "2%" }}>
                <Button
                  content="Sync Squads"
                  icon="database"
                  onClick={onSync}
                  loading={syncLoading}
                  color="youtube"
                />
                <Button
                  content="Create Match"
                  icon="save"
                  onClick={ultimateSaveMatch}
                  loading={ultimateSaveLoading}
                  color="facebook"
                />
              </div>
            </div>
            <hr className={styles.hr} />
            <div
              className={styles.parentDiv}
              style={{ height: "100%", overflowY: "hidden" }}
            >
              <div
                style={{
                  overflowY: "auto",
                  height: "100%",
                  width: "50%",
                  paddingRight: "0.5vw",
                }}
                className={styles.scroll1}
              >
                <div
                  className={styles.articleParent}
                  style={{ paddingTop: "1vh", zIndex: 3 }}
                >
                  <Article
                    title={
                      homeTeam &&
                      teams &&
                      teams.find((item) => item.value === homeTeam).text
                    }
                    logo={
                      homeTeam &&
                      teamData &&
                      teamData.find((item) => item.id === homeTeam).logo
                    }
                  />
                  <p className={styles.starter}>
                    Starters: {homeFirstXI.length} /\ Subs: {homeSubs.length}
                  </p>
                </div>

                {homePlayers &&
                  (!homePlayers ? (
                    <div className={styles.loaderHolder}>
                      <Loader inline active inverted size="large">
                        loading
                      </Loader>
                    </div>
                  ) : homePlayers.length < 1 ? (
                    <p className={styles.note}>
                      No players registered to this team!
                    </p>
                  ) : (
                    homePlayers.map((value, index) => (
                      <PlayerProfile
                        photo={value.photo}
                        position={value.position_type}
                        number={value.number}
                        fname={value.first_name}
                        lname={value.last_name}
                        key={index}
                        playerId={value.id}
                        haveBeenSynced={shouldSync}
                        syncedValue={value.starter && value.starter}
                        updateStarterDB={updateHomeStartingXI}
                        updateOverallStarter={updateOverallStarterHome}
                        updateSubsDB={updateHomeSubs}
                        updateOverallSubs={updateOverallSubsHome}
                      />
                    ))
                  ))}
              </div>
              <div
                style={{
                  overflowY: "auto",
                  height: "100%",
                  width: "50%",
                  paddingLeft: "0.5vw",
                  paddingRight: "0.5vw",
                }}
                className={styles.scroll2}
              >
                <div
                  style={{ paddingTop: "1vh", zIndex: 3 }}
                  className={styles.articleParent}
                >
                  <Article
                    title={
                      awayTeam &&
                      teams &&
                      teams.find((item) => item.value === awayTeam).text
                    }
                    logo={
                      awayTeam &&
                      teamData &&
                      teamData.find((item) => item.id === awayTeam).logo
                    }
                  />
                  <p className={styles.starter}>
                    Starters: {awayFirstXI.length} /\ Subs: {awaySubs.length}
                  </p>
                </div>

                {awayPlayers &&
                  (!awayPlayers ? (
                    <div className={styles.loaderHolder}>
                      <Loader inline active inverted size="large">
                        loading
                      </Loader>
                    </div>
                  ) : awayPlayers.length < 1 ? (
                    <p className={styles.note}>
                      No players registered to this team!
                    </p>
                  ) : (
                    awayPlayers.map((value, index) => (
                      <PlayerProfile
                        photo={value.photo}
                        position={value.position_type}
                        number={value.number}
                        fname={value.first_name}
                        lname={value.last_name}
                        key={index}
                        playerId={value.id}
                        haveBeenSynced={shouldSync}
                        syncedValue={value.starter && value.starter}
                        updateStarterDB={updateAwayStartingXI}
                        updateOverallStarter={updateOverallStarterAway}
                        updateSubsDB={updateAwaySubs}
                        updateOverallSubs={updateOverallSubsAway}
                      />
                    ))
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div ref={manageTeamErrorRef} className={styles.manageTeamError}>
          <p className={styles.par}>{manageTeamError}</p>
        </div>
      </div>
    </div>
  );
}

export default MatchesPage;

const style = {
  minHeader: {
    color: "rgb(254, 245, 187)",
  },
  mainHeader: {
    color: "rgb(200, 212, 28)",
  },
};
