import NavBar from "../components/Navbar";
import Router, { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import styles from "../static/css/competition.module.css";
import Title from "../components/Header";
import Input from "../components/Input";
import ImageInput from "../components/ImageInput";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { API_URL } from "../globals/domain";
import Message from "../components/Message";
import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { noDuplicatesCtx } from "../utils/noDuplicatesCtx";
let bc = new BroadcastChannel("MatchContextBroadcast");

function Competition() {
  const MatchContext = useContext(AppContext);
  const router = useRouter();

  const interval = useRef();
  const errorRef = useRef();
  const successRef = useRef();
  const [profile, setProfile] = useState();
  const [inputValue, setInput] = useState();
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    return () => {
      if (interval.current) {
        clearTimeout(interval.current);
      }
    };
  }, []);

  async function onSave() {
    // we should make sure on-click the button if is loading is "True" then nothing should happend
    if (loading) {
      return;
    }

    setLoading(true);
    if (!profile || inputValue.trim().length === 0) {
      errorRef.current.style.display = "block";
      {
        /* https://stackoverflow.com/questions/62520334/how-to-clear-interval-in-functional-component-if-interval-is-set-in-a-function
        thsi is how to assing the 'interval' in order to help us clearing it in useEffect kitu hichi nilishawahi fanya huko nyuma in 
         personalyzer in Navbar.js but nilisahau kidogo.. */
      }
      interval.current = setTimeout(() => {
        errorRef.current.style.display = "none";
      }, 5000);

      setLoading(false); // hii inabd isiwepo ili itusaidie kuweza ku-disable button to not being clicked again...
      return;
    }

    {
      /* 
      File or image ili iwe encoded or transferred by formData it should posses the object containg these attributes
      'uri', 'type' and 'name'... the 'uri' is actual path of image to upload BUT IN MAY CASE THE FILE RETURNED HERE DOES 
      NOT POSSESS THE 'uri' NA NDO MAANA INAKATAA DUH SIJUI NIFANYEJE HAPA NA NIMEKUJA KUGUNDUA HIVI BAADA YA KUCHECK HII 
      VIDEO https://www.youtube.com/watch?v=FVN3InBGvHA SEE 12:00 utagundua hichi ndo kitu kinachohitajika everytime u use 
      form data to upload image...   
  */
    }

    const uploadData = new FormData();
    uploadData.append("logo", profile);
    uploadData.append("name", inputValue.trim());

    {
      /* YOU CAN'T STRINGIFY IMAGE.. IN CASE YOU WANT TO UPLOAD ON THE BACKEND.. USE FormData() functionality
         offered by js and make sure you didn't set content type if you use Form Data */
    }

    const response = await fetch(`${API_URL}/api/addCompetition/`, {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();
    // display the message, success message...
    successRef.current.style.display = "block";
    interval.current = setTimeout(() => {
      successRef.current.style.display = "none";
      setLoading(false);
      Router.push({ pathname: "/assets", query: { active: 1 } });
    }, 3000);
  }

  function updateLogo(logo) {
    setProfile(logo);
  }

  function updateInput(value) {
    setInput(value);
  }

  {
    /* 
        https://nextjs.org/docs/api-reference/next/router#routerbeforepopstate
        The popstate event of the Window interface is fired when the active history
        entry changes while the user navigates the session history. It changes the 
        current history entry to that of the last page the user visited or, if history.pushState()
        has been used to add a history entry to the history stack, that history entry is used instead. 
        https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event

        'url', 'as' and options are parameter passed automatically to our callback, just read on
        this link here https://nextjs.org/docs/api-reference/next/router#routerbeforepopstate
    */
  }
  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      if (as === "/assets" || as.includes("assets?active")) {
        {
          /*
                 then here i want to send some data on my url .. so everything is good here .. so if we
                 from '/assets' we should have query contained in our url which holds competition.. 
                 hii window.location .. kazi yake ni ku-make next url in our browser to look like we want
                 here... so now by having this we can extract in our 'assets' the 'active'=> sidebar options to
                 be displayed so if last time in our /assets' navigate to 'players' we'll make him back to that
                 position this is good for USER EXPERIENCE...
                */
        }
        window.location.href = "/assets" + "?active=1";
      }
      // if we dont come from '/assets' lets say we came from '/assets?query=dada' then this is different url
      // we'll not update or make the url of browser to be displayed as above in if statement
      return true;
    });
  }, [router]);

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <Title title="Competition" optionTitle="Create" />
        <hr />
        <Button
          content="Save Competition"
          icon="save outline"
          className={styles.sma}
          onClick={onSave}
          loading={loading}
        />
        <div className={styles.error} ref={errorRef}>
          <Icon name="warning" color="red" />
          We don't accept empyt field(s)
        </div>
        <div className={styles.success} ref={successRef}>
          <Message content="Competition has been created successful." />
        </div>

        <div className={styles.inputContainer}>
          <Input
            label="Competition name"
            style={{ paddingRight: "100px" }}
            save={updateInput}
          />
          <ImageInput title="Upload logo" save={updateLogo} />
        </div>
      </div>
    </div>
  );
}

export default Competition;
