import NavBar from "../components/Navbar";
import Router, { useRouter } from "next/router";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useContext,
} from "react";
import styles from "../static/css/player.module.css";
import Title from "../components/Header";
import { Button, Checkbox, Dropdown, Icon } from "semantic-ui-react";
import Message from "../components/Message";
import Input from "../components/Input";
import ImageInput from "../components/ImageInput";
import { API_URL } from "../globals/domain";
import { capitalizeString } from "../utils/capitalize";
import { AppContext } from "../store/AppContext";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";

let bc = new BroadcastChannel("MatchContextBroadcast");

const POSITION_TYPE = [
  { key: "Goalkeeper", value: "Goalkeeper", text: "Goalkeeper" },
  { key: "Defender", value: "Defender", text: "Defender" },
  { key: "Midfielder", value: "Midfielder", text: "Midfielder" },
  { key: "Forward", value: "Forward", text: "Forward" },
];

const POSITION_NAME = [
  { key: "GK", value: "GK", text: "GK" },
  { key: "CB", value: "CB", text: "CB" },
  { key: "RB", value: "RB", text: "RB" },
  { key: "LB", value: "LB", text: "LB" },
  { key: "DM", value: "DM", text: "DM" },
  { key: "LW", value: "LW", text: "LW" },
  { key: "RW", value: "RW", text: "RW" },
  { key: "AM", value: "AM", text: "AM" },
  { key: "CM", value: "CM", text: "CM" },
  { key: "S", value: "S", text: "S" },
  { key: "FW", value: "FW", text: "FW" },
  { key: "CF", value: "CF", text: "CF" },
];

function Player() {
  const MatchContext = useContext(AppContext);

  const errorRef = useRef();
  const successRef = useRef();
  const playerTimeout = useRef();
  const [loading, setLoading] = useState();
  const [team, setTeam] = useState();
  const [pType, setPType] = useState();
  const [pName, setPName] = useState();
  const [checked, setChecked] = useState(false);
  const [profile, setProfile] = useState();
  const [fname, setFname] = useState();
  const [lname, setLName] = useState();
  const [number, setNumber] = useState();
  const [error, setError] = useState();
  const [fetchedTeams, setFetchedTeam] = useState();
  const [needsContext, setNeedContext] = useState(0);

  const router = useRouter();

  useEffect(() => {
    console.log("at mount sync me!");
    bc.postMessage("Sync me!");

    bc.onmessage = ({ data }) => {
      if (data === "Sync me!") {
        console.log("someone need to be synced");
        setNeedContext((prevState) => prevState + 1);
      }
      if (data.matches) {
        // mara nyingi ili tusi-affect the value of our context lets store our context in given variable
        const matches = [...data.matches];
        const noDupCtx = noDuplicatesCtx(matches);
        MatchContext.syncMatches(noDupCtx);
      }

      if (data.new && data.metadataObj) {
        console.log("im creating new match");
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

  useLayoutEffect(() => {
    fetch(`${API_URL}/api/teams/`)
      .then((response) => response.json())
      .then((json) => {
        const teams = json.map((item) => ({
          key: item.name,
          value: item.id,
          text:
            item.name.length > 27 ? item.name.substr(0, 28) + "..." : item.name,
          image: { src: item.logo },
        }));
        setFetchedTeam(teams);
      });
  }, []);

  async function onSave() {
    console.log("This is context having the matches ", MatchContext.matches);

    if (loading) {
      return;
    }

    setLoading(true);
    // add validations
    if (
      !team ||
      pType.trim().length < 1 ||
      pName.trim().length < 1 ||
      fname.trim().length < 1 ||
      lname.trim().length < 1 ||
      number.trim().length < 1
    ) {
      setError("We don't accept empty fields!");
      errorRef.current.style.display = "block";
      playerTimeout.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 5000);
      setLoading(false);
      return;
    }

    // if we try to convert any non converted string to number it return 'NaN' obj
    {
      /*
      how to check if value is 'NaN' object.. as you know  objects are reference variables 
      so to check their value is quite tricky because they holds the 'address' of variables 
      and not actual value for example >>> so to check if Number() function return NaN object 
      we need to use build function to check this.. >>> owever you want to check for NaN specifically, or avoid type coercion;
      you can use Number.isNaN instead .. for more this is link for you to follow
      https://stackoverflow.com/questions/6976721/is-nan-equal-to-nan 
  */
    }
    if (isNaN(Number(number.trim()))) {
      setError("Player kit number should be number");
      errorRef.current.style.display = "block";
      playerTimeout.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 3000);
      setLoading(false);
      return;
    }

    // all testing is good...
    const uploadData = new FormData();
    const capitalizedName = capitalizeString(fname);
    const capitalizedLName = capitalizeString(lname);
    const kit_number = Number(number);

    uploadData.append("fname", capitalizedName);
    uploadData.append("lname", capitalizedLName);
    uploadData.append("number", kit_number);
    uploadData.append("profile", profile);
    uploadData.append("team", team);
    uploadData.append("starter", checked);
    uploadData.append("ptype", pType);
    uploadData.append("pname", pName);

    const response = await fetch(`${API_URL}/api/addPlayer/`, {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
      errorRef.current.style.display = "block";
      playerTimeout.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 3000);
      setLoading(false);
      return;
    }

    // everything is good
    successRef.current.style.display = "block";
    playerTimeout.current = setTimeout(() => {
      successRef.current.style.display = "none";
      Router.push(`/assets?active=4`);
    }, 3000);
  }

  function updateLogo(file) {
    setProfile(file);
  }

  function updateInput(value) {
    setFname(value);
  }

  function updateInput2(value) {
    setLName(value);
  }

  function updateInput3(value) {
    setNumber(value);
  }

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      if (as === "/assets" || as.includes("assets?active")) {
        window.location.href = "/assets" + "?active=4";
      }
      return true;
    });
  }, [router]);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <Title title="Player" optionTitle="Create" />
        <hr />
        <Button
          content="Create player"
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
          <Message content="Player have been created successful." />
        </div>
        <div className={styles.inputContainer}>
          <Input
            label="Player's first name"
            style={{ paddingRight: "60px" }}
            save={updateInput}
          />
          <Input
            label="Player's last name"
            style={{ paddingRight: "60px" }}
            save={updateInput2}
          />
          <Input
            label="Player's kit number"
            save={updateInput3}
            max={3}
            num="required"
          />
        </div>
        <div className={styles.inputContainer1}>
          <div style={{ marginRight: "60px" }}>
            <label className={styles.lab}>Add team:</label>
            <br />
            <div style={{ width: "300px" }}>
              <Dropdown
                placeholder="type sth..."
                fluid
                search
                selection
                options={fetchedTeams}
                onChange={(e, { value }) => setTeam(value)}
              />
              <small
                onClick={() =>
                  Router.push({ pathname: "/team", query: { next: "player" } })
                }
                className={styles.sm}
              >
                Create new team
              </small>
            </div>
          </div>
          <div style={{ marginRight: "60px" }}>
            <label className={styles.lab}>Position type:</label>
            <br />
            <div style={{ width: "300px" }}>
              <Dropdown
                placeholder="type sth..."
                fluid
                search
                selection
                options={POSITION_TYPE}
                onChange={(e, { value }) => setPType(value)}
              />
            </div>
          </div>
          <div>
            <label className={styles.lab}>Position name:</label>
            <br />
            <div style={{ width: "300px" }}>
              <Dropdown
                placeholder="type sth..."
                fluid
                search
                selection
                options={POSITION_NAME}
                onChange={(e, { value }) => setPName(value)}
              />
            </div>
          </div>{" "}
        </div>
        <div className={styles.inputContainer2}>
          <div style={{ marginRight: "150px" }}>
            <ImageInput title="Player's profile picture" save={updateLogo} />
          </div>
          <div>
            <label className={styles.lab}>Is starter?</label>
            <br />
            <Checkbox
              onChange={(e, { checked }) => setChecked(checked)}
              toggle
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
