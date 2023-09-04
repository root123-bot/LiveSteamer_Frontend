import { useEffect, useState } from "react";
import { Checkbox } from "semantic-ui-react";
import { API_URL } from "../globals/domain";
import styles from "../static/css/pprofile.module.css";

function PlayerProfile({
  photo,
  position,
  number,
  fname,
  lname,
  haveBeenSynced,
  syncedValue,
  playerId,
  updateStarterDB,
  updateOverallStarter,
  updateSubsDB,
  updateOverallSubs,
}) {
  {
    /* photo ? `${API_URL}${photo}` : "../static/images/anonymous.png" */
  }

  {
    /* so we can detect if we are in mode of 'onSync' by checking 'haveBeenSynced' state and 
      remember all checkbox will be in that mode if user tried to sync squad.. otherwise if 
      the user 'haven't sync will take isStarterNotUpdatedBySync state */
  }

  {
    /* since we use .bind(this, playerId) it means it will first bind the 'playerId' before other parameter passed/binded automatically
      by the callback THAT'S WHY YOU SHOULD MAKE SURE YOU EXTRACTED IT 'playerId' AT FIRST AS YOU SHOULD
      REMEMBER THAT THE ORDER MATTER.. KO HERE NILIKUWA NASUMBUKA KUJUA NI JINSI GANI NITAPASS VALUE IN CALLBACK
      WHICH RECEIVE OTHER VALUES AUTOMATICALLY AND NOW I HAVE THE ANSWER YOU SHOULD BIND IT AND YOU SHOULD EXTRACT IT 
      AS THE FIRST VALUE HERE BECAUSE YOUR VALUE WILL BE THE FIRST ONE GET BINDED.. NAHISI UMENIELEWA  */
  }
  const [starter, setStarter] = useState(false);
  // by default 'sub' is false...
  const [isInSub, setIsInSub] = useState(false);
  const [validSync, setValidSync] = useState(0);
  useEffect(() => {
    if (haveBeenSynced) {
      {
        /* i need to make all 'bench' or sub to false anytime user click sync
        logic behind this i when user sync/make changes i need to make 
        validSync to 1(true) this means by default when we sync the BENCH will be 
        unchecked(false) just view on onBench checkbox.. But when we change the 
        bench checkbox means we're not onSync state so we should convert the 
        validSync to false(0) this will be used as 'flag' on bench onCheck to determine 
        whether to turn off bench WHICH ITS FINE IF WE CLICK SYNC or to turn it on when we 
        try to change sub checkbox 
        AND YOU SHOULD REMEMBER IF WE TURN OFF ALL THE 'BENCH' CHECKBOX WE NEED TO 
        UPDATE ARRAY OF SUBS TO BE EMPTY*/
      }
      setValidSync(validSync + 1);
      {
        /* according when user click on sync we said bench should be zero ko lets do here */
      }
      updateOverallSubs();
      setStarter(syncedValue);
      {
        /* don't forget to update overall starter... this is enabled onSync ko we should return all starters according to sync */
      }
      updateOverallStarter();
    }
  }, [haveBeenSynced, syncedValue]);

  function updateStarter(playerId, e, { checked }) {
    // I need to first change checked while i need to check if 'isBench' is true then i should turn it off
    // this process goes the same when change the bench...
    if (isInSub) {
      // if is inSub true then first i need to make it to false
      setIsInSub(!isInSub);
      updateSubsDB(playerId, "remove");
    }
    // after that then i need to update is starter
    setStarter(checked);
    updateStarterDB(playerId, checked ? "add" : "remove");
  }

  function updateSub(playerId, e, { checked }) {
    if (starter) {
      setStarter(!starter);
      // if you turn on 'starter' you should update the starter db
      updateStarterDB(playerId, "remove");
    }
    {
      /* SEE FROM USEEFFECT OF [haveBeenSynced, syncedValue]  i need to make all 'bench' or sub to false anytime user click sync
      logic behind this i when user sync/make changes i need to make 
      validSync to 1(true) this means by default when we sync the BENCH will be 
      unchecked(false) just view on onBench checkbox.. But when we change the 
      bench checkbox means we're not onSync state so we should convert the 
      validSync to false(0) this will be used as 'flag' on bench onCheck to determine 
      whether to turn off bench WHICH ITS FINE IF WE CLICK SYNC or to turn it on when we 
      try to change sub checkbox */
    }
    setValidSync(0);
    setIsInSub(checked);
    updateSubsDB(playerId, checked ? "add" : "remove");
  }

  return (
    <div className={styles.container}>
      <div className={styles.holder}>
        <img
          src={
            photo.includes("undefined")
              ? "../static/images/anonymous.png"
              : `${API_URL}${photo}`
          }
          className={styles.photo}
        />
        <div className={styles.holder2}>
          <div>
            <span className={styles.pnum}>#{number}</span>
            <span className={styles.pname}>
              {fname} {lname}
            </span>
          </div>
          <div>
            <img src="../static/images/point.png" className={styles.pointer} />
            <span className={styles.post}>{position}</span>
          </div>
        </div>
      </div>
      <div className={styles.checkHolder}>
        <Checkbox
          checked={starter}
          label="Starter"
          toggle
          className={styles.checkBox}
          onChange={updateStarter.bind(this, playerId)}
        />
        <br />
        {/* fails to turn off 'bench' off is we sync and value of starter is 'true', also if you can do you
            can 'turnOff' bench if is starter is false... or you can make sure if 
            isstarter turn on to make it turn off*/}
        <Checkbox
          onChange={updateSub.bind(this, playerId)}
          label="Bench"
          toggle
          className={styles.checkBox}
          checked={isInSub && !starter && !validSync}
        />
      </div>
    </div>
  );
}

export default PlayerProfile;
