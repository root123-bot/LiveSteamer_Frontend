import NavBar from "../components/Navbar";
import Router, { useRouter } from "next/router";
import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import Title from "../components/Header";
import styles from "../static/css/team.module.css";
import { Button, Icon } from "semantic-ui-react";
import Message from "../components/Message";
import Input from "../components/Input";
import ImageInput from "../components/ImageInput";
import { API_URL } from "../globals/domain";
import ImageInput2 from "../components/ImageInput2";
import ImageInput3 from "../components/ImageInput3";
import DropdownDiv from "../components/DropdownDiv";
import { capitalizeString } from "../utils/capitalize";
import { AppContext } from "../store/AppContext";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";
const bc = new BroadcastChannel("MatchContextBroadcast");

// Ngoja nifetch hizi options nje b4 component is mounted
// this dropdown object on change pass to your callback a 'event' and
// 'data' object .. the 'data' object it contains the 'value' attribute
// which contain the actual value of selected option .. for more
// https://react.semantic-ui.com/modules/dropdown/#types-inline
// air suspension control module land rover, pin layout, connector layout wiring diagram

function Team() {
  const MatchContext = useContext(AppContext);

  const errorRef2 = useRef();
  const successRef2 = useRef();
  const createCompRef = useRef();
  const errorRef = useRef();
  const successRef = useRef();
  const fatherRef = useRef();
  const compInterval = useRef();
  const closeRef = useRef();
  const createVenRef = useRef();
  const closeRefx = useRef();
  const errorRef3 = useRef();
  const successRef3 = useRef();
  const errorRef4 = useRef();
  const successRef4 = useRef();
  const venueTimeoutRef = useRef();
  const teamTimeout = useRef();
  const createManagerRef = useRef();
  const closeRefManager = useRef();
  const managerTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamShortName, setTeamShortName] = useState("");
  const [teamLogo, setTeamLogo] = useState();
  const [error, setError] = useState();
  const [needsContext, setNeedContext] = useState(0);
  const [assignedManager, setAssignedMananger] = useState([]);
  const [managerData, setManagerData] = useState([]);
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

  {
    /* is these two state considered as the one which will holds the
      the actual value of selected stadium and selected competition, 
    other state like 'addedComp' and 'addedVenue' are there for other purpose 
    so actually to have get the value of these two dropdown you should consider
    this two state because they are manipulated first when user add new comp/venue 
    and when user manually change or pick/select value in dropdown*/
  }
  const [valueOfCompetitionDropDown, setValueOfCompetitionDropDown] =
    useState();
  const [valueOfVenuesDropDown, setValueOfVenueDropDown] = useState();
  const [saveLoading, setSaveLoading] = useState(false);
  const [comp, setComp] = useState();
  const [ven, setVen] = useState();
  const [compInput, setCompInput] = useState();
  const [compProfile, setCompProfile] = useState();
  const [clearImg, setClearImg] = useState();
  const [addedComp, setAddedComp] = useState();
  const [compErrorMessage, setCompErrorMessage] = useState();
  const [saveVenueLoading, setSaveVenueLoading] = useState();
  const [clearVenueTxt, setClearVenueTxt] = useState();
  const [venueName, setVenueName] = useState();
  const [venueAddress, setVenueAddress] = useState();
  const [venErrorMessage, setVenErrorMessage] = useState();
  const [addedVenue, setAddedVenue] = useState();
  const [next, setNext] = useState();
  const [saveManagerLoading, setSaveManagerLoading] = useState();
  const [managerErrorMessage, setManagerErrorMessage] = useState();
  const [managerFname, setManagerFname] = useState("");
  const [managerLname, setManagerLname] = useState("");
  const [managerPhoto, setManagerPhoto] = useState();
  const [clearManagerData, setClearManagerData] = useState();
  const [addedManager, setAddedManager] = useState();
  const router = useRouter();

  function onRemove(e) {
    e.preventDefault();
    setClearImg(); // here we should change the clearImage to 'undefined'..ENDAPO UTAPASS 'NOTHING' IN THIS FUNCTION WILL ASSIGN 'undefined' TO OUR STATE...
    document.body.style.background = "#fff";
    fatherRef.current.style.display = "block";
    createCompRef.current.style.display = "none";
    fatherRef.current.style.pointerEvents = "auto";
  }

  function saveCoach() {
    setSaveManagerLoading(true);

    // its not mandatory to have manager photo...
    if (managerFname.trim().length < 1 || managerLname.trim().length < 1) {
      setManagerErrorMessage("Error, we don't accept empty fields");
      errorRef4.current.style.display = "block";
      managerTimeoutRef.current = setTimeout(() => {
        errorRef4.current.style.display = "none";
      }, 2000);
      setSaveManagerLoading(false);
      return;
    }

    {
      /* what we want to do here is actually to not write the data to the DB why because we don't
        want to have many managers.. so here lets hold data in fly we know they are in states.....
        i think there is a need to display the successMessage.. here also we need to assign 
        data to options so as to load it to the manager..*/
    }

    setSaveManagerLoading(false);
    successRef4.current.style.display = "block";
    managerTimeoutRef.current = setTimeout(() => {
      successRef4.current.style.display = "none";
    }, 2000);

    const manager = [
      {
        key: managerFname,
        value: managerFname,
        text: managerFname + " " + managerLname,
        image: {
          src: "../static/images/anonymous.png",
        },
      },
    ];

    setManagerData([managerFname, managerLname, managerPhoto]);

    setClearManagerData();

    setAssignedMananger(manager);
    // then how to set the default value..
    setAddedManager(managerFname);
    document.body.style.background = "#fff";
    fatherRef.current.style.display = "block";
    createManagerRef.current.style.display = "none";
    fatherRef.current.style.pointerEvents = "auto";
  }

  function triedToChangeManager(value) {
    /* it does not make sense we actually does not save the 
    manager to the DB, we hold the value of manager of the team
    inside our state.. so we put tis just to make our code work */
  }

  useLayoutEffect(() => {
    const nextUrl = router.asPath.substring(router.asPath.indexOf("=") + 1);

    setNext(nextUrl);

    fetch(`${API_URL}/api/competitions`)
      .then((response) => response.json())
      .then((json) => {
        const competitions = json.map((item) => ({
          key: item.name,
          value: item.id,
          text:
            item.name.length > 30 ? item.name.substr(0, 28) + "..." : item.name,
          image: { src: item.logo },
        }));
        setComp(competitions);
      });
    fetch(`${API_URL}/api/venues`)
      .then((response) => response.json())
      .then((json) => {
        const venues = json.map((item) => ({
          key: item.name,
          value: item.id,
          text:
            item.name.length > 30 ? item.name.substr(0, 28) + "..." : item.name,
        }));
        setVen(venues);
      });
    // hii use effect ina-run only on mounting but i want it to run or fetch data again when
    // user click add new......
  }, []);

  useEffect(() => {
    return () => {
      if (compInterval.current) {
        clearTimeout(compInterval.current);
      }
      if (venueTimeoutRef.current) {
        clearTimeout(venueTimeoutRef.current);
      }

      if (teamTimeout.current) {
        clearTimeout(teamTimeout.current);
      }

      if (managerTimeoutRef.current) {
        clearTimeout(teamTimeout.current);
      }
    };
  }, []);

  function changeCompetitionHandler(value) {
    setValueOfCompetitionDropDown(value);
  }

  function changeStadiumHandler(value) {
    setValueOfVenueDropDown(value);
  }

  function updateInput2(value) {
    setCompInput(value);
  }

  function updateInput3(value) {
    setVenueName(value);
  }

  function updateInput4(value) {
    setVenueAddress(value);
  }

  function updateLogo2(logo) {
    setCompProfile(logo);
  }

  function addManager() {
    setClearManagerData(true);
    const dimensions = fatherRef.current.getBoundingClientRect();

    document.body.style.background =
      "linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .4))";

    fatherRef.current.style.pointerEvents = "none";
    fatherRef.current.style.display = "block";
    createManagerRef.current.style.display = "block";
    createManagerRef.current.style.left = dimensions.left.toString() + "px";
  }

  function onRemovem(e) {
    e.preventDefault();
    setClearManagerData();
    // i think we should change value of clear again after the user save manager... but lets see i thinks there is no need since component will re-render and clear values...
    document.body.style.background = "#fff";
    fatherRef.current.style.display = "block";
    createManagerRef.current.style.display = "none";
    fatherRef.current.style.pointerEvents = "auto";
  }

  function onRemovex(e) {
    e.preventDefault();
    setClearVenueTxt();
    document.body.style.background = "#fff";
    fatherRef.current.style.display = "block";
    createVenRef.current.style.display = "none";
    fatherRef.current.style.pointerEvents = "auto";
  }

  function updateManagerFname(value) {
    setManagerFname(value);
  }

  function updateManagerLname(value) {
    setManagerLname(value);
  }

  function updateManagerPhoto(value) {
    setManagerPhoto(value);
  }

  async function onSubmitVenue() {
    if (saveVenueLoading) {
      return;
    }
    setSaveVenueLoading(true);
    if (venueName.trim().length === 0 || venueAddress.trim().length === 0) {
      setVenErrorMessage("Error, we don't accept empty fields");
      errorRef3.current.style.display = "block";
      venueTimeoutRef.current = setTimeout(() => {
        errorRef3.current.style.display = "none";
      }, 5000);
      setSaveVenueLoading(false);
      return;
    }

    const uploadData = new FormData();
    const capitalizedName = capitalizeString(venueName);
    uploadData.append("address", venueAddress.trim());
    uploadData.append("name", capitalizedName.trim());

    const response = await fetch(`${API_URL}/api/addVenue/`, {
      method: "POST",
      body: uploadData,
    });

    // this is where we put another 'error' if stadium name already exist..

    // if data saved successfully
    const data = await response.json();
    if (data.error) {
      // only error we expect to receive here is when user pass the existing name
      setVenErrorMessage("The name of stadium already exist, pick another one");
      errorRef3.current.style.display = "block";
      venueTimeoutRef.current = setTimeout(() => {
        errorRef3.current.style.display = "none";
      }, 5000);
      setSaveVenueLoading(false);
      return;
    }
    const venId = data.venue_id;
    setAddedVenue(venId);
    setValueOfVenueDropDown(venId); // its the second time valueofvenue setted, its good since it can be manipulated either when user add new venue or on change

    // then let's fetch the allvenues again...
    fetch(`${API_URL}/api/venues`)
      .then((response) => response.json())
      .then((json) => {
        const venues = json.map((item) => ({
          key: item.name,
          value: item.id,
          text:
            item.name.length > 30 ? item.name.substr(0, 28) + "..." : item.name,
        }));
        setVen(venues);
        // after fetching data and everything is good then display message.
        successRef3.current.style.display = "block";
        // hapa ndo inapoishia... inaganda hapa...
        venueTimeoutRef.current = setTimeout(() => {
          successRef3.current.style.display = "none";

          // then let's set the default value to our competition dropdown

          // finally lets return to our main page...
          document.body.style.background = "#fff";
          fatherRef.current.style.display = "block";
          createVenRef.current.style.display = "none";
          fatherRef.current.style.pointerEvents = "auto";
          setClearVenueTxt(); // here we should change the clearImage to 'undefined'..ENDAPO UTAPASS 'NOTHING' IN THIS FUNCTION WILL ASSIGN 'undefined' TO OUR STATE...  again, because if we don't do that then the image will not be cleared in ImageInput2.js...
          setSaveVenueLoading(false);
        }, 3000);
      });
  }

  async function onSubmitComp() {
    if (saveLoading) {
      return;
    }

    setSaveLoading(true);
    if (!compProfile || compInput.trim().length === 0) {
      setCompErrorMessage("We don't accept empty fields");
      errorRef2.current.style.display = "block";
      compInterval.current = setTimeout(() => {
        errorRef2.current.style.display = "none";
      }, 5000);
      setSaveLoading(false);
      return;
    }
    const uploadData = new FormData();
    const capitalizedName = capitalizeString(compInput);
    uploadData.append("logo", compProfile);
    uploadData.append("name", capitalizedName);

    const response = await fetch(`${API_URL}/api/addCompetition/`, {
      method: "POST",
      body: uploadData,
    });

    // after saving competition we should hold the id of the competiton saved also
    // we should fetch the competiton api again so as to be updated.. And then we need
    // to choose or set our option to use the saved competition as the 'value' assigned..
    const data = await response.json();
    if (data.error) {
      // only error i expect here is unique, error comp name should not be the same
      setCompErrorMessage(
        "The name of competition already exist, pick another one!"
      );
      errorRef2.current.style.display = "block";
      compInterval.current = setTimeout(() => {
        errorRef2.current.style.display = "none";
      }, 5000);
      setSaveLoading(false);
      return;
    }
    const compId = data.id;
    setAddedComp(compId);
    setValueOfCompetitionDropDown(compId); // its the second time valueof competition setted, its good since it can be manipulated either when user add new competition or on change

    // then let's fetch the competition again..
    fetch(`${API_URL}/api/competitions`)
      .then((response) => response.json())
      .then((json) => {
        const competitions = json.map((item) => ({
          key: item.name,
          value: item.id,
          text:
            item.name.length > 30 ? item.name.substr(0, 28) + "..." : item.name,
          image: { src: item.logo },
        }));
        setComp(competitions);
        // after fetching data and everything is good then display message.
        successRef2.current.style.display = "block";
        // hapa ndo inapoishia... inaganda hapa...
        compInterval.current = setTimeout(() => {
          successRef2.current.style.display = "none";

          // then let's set the default value to our competition dropdown

          // finally lets return to our main page...
          document.body.style.background = "#fff";
          fatherRef.current.style.display = "block";
          createCompRef.current.style.display = "none";
          fatherRef.current.style.pointerEvents = "auto";
          setClearImg(); // here we should change the clearImage to 'undefined'..ENDAPO UTAPASS 'NOTHING' IN THIS FUNCTION WILL ASSIGN 'undefined' TO OUR STATE...  again, because if we don't do that then the image will not be cleared in ImageInput2.js...
          setSaveLoading(false);
        }, 3000);
      });
  }

  async function onSave() {
    setLoading(true);
    {
      /* what kind of error i expect to receive, first one when value 
        of field is empty, nyingine labda ya unique of 'team' name and shortname
         we can verify if manager get created by checking manager fname */
    }
    if (
      teamName.trim().length < 1 ||
      teamShortName.trim().length < 1 ||
      managerData.length < 2 ||
      !teamLogo ||
      !valueOfVenuesDropDown ||
      !valueOfCompetitionDropDown
    ) {
      setError("We don't accept empty field(s)");

      errorRef.current.style.display = "block";

      teamTimeout.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 5000);
      setLoading(false);
      return;
    }

    const uploadData = new FormData();
    const capitalizedName = capitalizeString(teamName);
    uploadData.append("venue", parseInt(valueOfVenuesDropDown));
    uploadData.append("comp", parseInt(valueOfCompetitionDropDown));
    uploadData.append("short", teamShortName.trim().toUpperCase());
    uploadData.append("logo", teamLogo);
    uploadData.append("name", capitalizedName);
    uploadData.append("mlname", managerData[1]);
    uploadData.append("mfname", managerData[0]);
    uploadData.append("mphoto", managerData[2]); // this will be 'undefined' if there is no any image uploaded by the user.
    const response = await fetch(`${API_URL}/api/addTeam/`, {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (data.error) {
      setError(
        data.error,
        ", either Team name, short name already found, try to pick unique one!"
      );
      errorRef.current.style.display = "block";

      teamTimeout.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 5000);
      setLoading(false);
      return;
    }

    // everything have been saved..
    successRef.current.style.display = "block";
    teamTimeout.current = setTimeout(() => {
      successRef.current.style.display = "none";
      if (!next) {
        return Router.push("/assets?active=2");
      }
      return Router.push(`${next}`); // /${next}
      // setLoading(false);
    }, 5000);
  }

  function updateInput0(value) {
    setTeamShortName(value);
  }
  function updateInput1(value) {
    setTeamName(value);
  }

  function updateLogo(logo) {
    setTeamLogo(logo);
  }

  function createCompetition() {
    setClearImg(true);
    const dimensions = fatherRef.current.getBoundingClientRect();

    document.body.style.background =
      "linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .4))";
    fatherRef.current.style.pointerEvents = "none";

    createCompRef.current.style.display = "block";
    createCompRef.current.style.left = dimensions.left.toString() + "px";
  }

  function createStadium() {
    setClearVenueTxt(true);
    const dimensions = fatherRef.current.getBoundingClientRect();

    document.body.style.background =
      "linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .4))";

    fatherRef.current.style.pointerEvents = "none";

    fatherRef.current.style.display = "block";
    createVenRef.current.style.display = "block";
    createVenRef.current.style.left = dimensions.left.toString() + "px";
  }

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      if (as === "/assets" || as.includes("assets?active")) {
        window.location.href = "/assets" + "?active=2";
      }
      return true;
    });
  }, [router]);

  return (
    <div>
      <NavBar />
      <div className={styles.container} ref={fatherRef}>
        <Title title="Team/Club" optionTitle="Create" />
        <hr />
        <Button
          content="Save Team"
          icon="save outline"
          className={styles.sma}
          onClick={onSave}
          loading={loading}
        />
        {/* */}

        <div className={styles.error} ref={errorRef}>
          <Icon name="warning" color="red" />
          {error}
        </div>
        <div className={styles.success} ref={successRef}>
          <Message content="Team has been created successful." />
        </div>
        {/* */}
        <div className={styles.inputContainer}>
          <Input
            label="Team name"
            style={{ paddingRight: "100px" }}
            save={updateInput1}
          />
          <Input
            label="Graphic name"
            style={{ paddingRight: "100px" }}
            save={updateInput0}
            max={5}
          />

          <div>
            <label className={styles.lab}>Competition:</label>
            <br />
            {/* hii imesaidia coz on mounting sometimes comp ni 'undefined' coz tunakuwa bado 
            hatuja-fetch data from our api.. so when i use a default value by saying
            hey 'defaultValue={comp[0].value} inaniambia 'comp' is 'undefined' so by doing this 
            here by checking the condition it make sure the Dropdown is used only when we have 
            a 'comp' and you should remember hata kama hatuna data in api we'll get [] which its good
            for this condition ... Na usiwaze ukasema labda haita-render this component haitoonekana in 
            our page.. usiwaze ishu ni ndogo tu coz umeiona hii 'comp' iki-change tu lazima component iwe
            -rendered so lazima we'll see our Dropdown */}

            <DropdownDiv
              options={comp}
              title="Create new competition"
              placeholder="Select competition"
              create={createCompetition}
              newComp={addedComp}
              changeHandler={changeCompetitionHandler}
            />
          </div>
        </div>
        <div className={styles.inputContainer1}>
          <div style={{ marginRight: "100px" }}>
            <label className={styles.lab}>Add stadium:</label>
            <br />
            <div style={{ width: "300px" }}>
              <DropdownDiv
                options={ven}
                title="Create new stadium"
                placeholder="Select stadium"
                create={createStadium}
                newComp={addedVenue}
                changeHandler={changeStadiumHandler}
              />
            </div>
          </div>
          {/* here you should add team manager */}
          <div style={{ marginRight: "100px" }}>
            <label className={styles.lab}>Team Manager:</label>
            <br />
            <div style={{ width: "300px" }}>
              {/* i dont expect to have onChangeHandler since user can't change the value of coach since we'll have only one
              list, then i expect options to change only after user have been adding the new coach so initially i count make it
              empty array... */}
              <DropdownDiv
                options={assignedManager}
                title="Add team manager"
                placeholder="Select stadium"
                create={addManager}
                newComp={addedManager}
                changeHandler={triedToChangeManager}
              />
            </div>
          </div>
          <ImageInput title="Upload logo" save={updateLogo} />
        </div>
      </div>
      <div ref={createCompRef} className={styles.createComp}>
        <Title title="Competition" optionTitle="Create" />
        <hr style={{ marginLeft: "2%", marginRight: "2%" }} />
        <div style={{ marginRight: "2%" }}>
          <Button
            content="Save Competition"
            icon="save outline"
            className={styles.sma}
            onClick={onSubmitComp}
            loading={saveLoading}
          />
        </div>
        <div className={styles.error} ref={errorRef2}>
          <Icon name="warning" color="red" />
          {compErrorMessage}
        </div>
        <div className={styles.success} ref={successRef2}>
          <Message
            content="Competition has been created successful."
            style={{ color: "rgb(41, 83, 25)" }}
          />
        </div>
        <div className={styles.inputContainer}>
          <Input
            label="Competition name"
            style={{ paddingRight: "100px" }}
            save={updateInput2}
            shouldBeCleared={clearImg}
          />
          <ImageInput2
            shouldBeCleared={clearImg}
            title="Upload logo"
            save={updateLogo2}
          />
        </div>
        <div className={styles.closeBtn} onClick={onRemove} ref={closeRef}>
          &times;
        </div>
      </div>
      <div ref={createManagerRef} className={styles.createManager}>
        <Title title="Manager" optionTitle="Add" />
        <hr style={{ marginLeft: "2%", marginRight: "2%" }} />
        <div style={{ marginRight: "2%" }}>
          <Button
            content="Save manager"
            icon="save outline"
            className={styles.sma}
            onClick={saveCoach}
            loading={saveManagerLoading}
          />
        </div>
        <div className={styles.errorMan} ref={errorRef4}>
          <Icon name="warning" color="red" />
          {managerErrorMessage}
        </div>
        <div className={styles.successMan} ref={successRef4}>
          <Message
            content="Team manager has been created successful."
            style={{ color: "rgb(41, 83, 25)" }}
          />
        </div>
        <div className={styles.inputContainer4}>
          <Input
            label="First name"
            style={{ paddingRight: "100px" }}
            save={updateManagerFname}
            shouldBeCleared={clearManagerData}
          />
          <Input
            label="Last name"
            save={updateManagerLname}
            shouldBeCleared={clearManagerData}
          />
        </div>
        <div style={{ paddingLeft: "2%", paddingTop: "3%" }}>
          <ImageInput3
            shouldBeCleared={clearManagerData}
            title="Manager image"
            save={updateManagerPhoto}
          />
        </div>
        <div
          className={styles.closeBtnx}
          onClick={onRemovem}
          ref={closeRefManager}
        >
          &times;
        </div>
      </div>

      <div ref={createVenRef} className={styles.createVenue}>
        <Title title="Stadium" optionTitle="Add" />
        <hr style={{ marginLeft: "2%", marginRight: "2%" }} />
        <div style={{ marginRight: "2%" }}>
          <Button
            content="Save Stadium"
            icon="save outline"
            className={styles.sma}
            onClick={onSubmitVenue}
            loading={saveVenueLoading}
          />
        </div>
        <div className={styles.error1} ref={errorRef3}>
          <Icon name="warning" color="red" />
          {venErrorMessage}
        </div>
        <div className={styles.success} ref={successRef3}>
          <Message
            content="Stadium has been created successful."
            style={{ color: "rgb(41, 83, 25)" }}
          />
        </div>
        <div className={styles.inputContainer3}>
          <Input
            label="Stadium name:"
            style={{ paddingRight: "100px" }}
            save={updateInput3}
            shouldBeCleared={clearVenueTxt}
          />
          <Input
            label="Stadium Location:"
            save={updateInput4}
            shouldBeCleared={clearVenueTxt}
          />
        </div>
        <div className={styles.closeBtnx} onClick={onRemovex} ref={closeRefx}>
          &times;
        </div>
      </div>
    </div>
  );
}

export default Team;
