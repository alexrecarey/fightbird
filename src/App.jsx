import 'react'
import {useState, useEffect, useRef} from 'react'
import {
  Container,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material'
import FightbirdRatingInput from './FightbirdRatingInput.jsx'
import {clone} from "ramda";
import WarcrowResultTable from "./WarcrowResultTable.jsx";


function App() {
  // App Status
  const [statusMessage, setStatusMessage] = useState("(loading...)");
  const workerRef = useRef(null);

  // Inputs Player A
  const [redA, setRedA] = useState(0);
  const [orangeA, setOrangeA] = useState(0);
  const [yellowA, setYellowA] = useState(0);
  const [greenA, setGreenA] = useState(0);
  const [blueA, setBlueA] = useState(0);
  const [blackA, setBlackA] = useState(0);
  const [hitA, setHitA] = useState(0);
  const [blockA, setBlockA] = useState(0);
  const [expertiseA, setExpertiseA] = useState(false)

  // Inputs Player B
  const [redB, setRedB] = useState(0);
  const [orangeB, setOrangeB] = useState(0);
  const [yellowB, setYellowB] = useState(0);
  const [greenB, setGreenB] = useState(0);
  const [blueB, setBlueB] = useState(0);
  const [blackB, setBlackB] = useState(0);
  const [hitB, setHitB] = useState(0);
  const [blockB, setBlockB] = useState(0);
  const [expertiseB, setExpertiseB] = useState(false)

  // Outputs
  const [icepoolResult, setIcepoolResult] = useState(null);


  // Worker message received
  const messageReceived = (msg) => {
    if (msg.data.command === 'result') {
      let value = msg.data.value;
      let cl = clone(value);
      setIcepoolResult(cl);
      setStatusMessage(`Done! Took ${msg.data.elapsed}ms to calculate all ${msg.data.totalRolls.toLocaleString()} possible rolls.`);
    } else if (msg.data.command === 'status') {
      if (msg.data.value === 'ready') {
        rollDice()
      }
    }
  }

  const workerError = (error) => {
    console.log(`Worker error: ${error.message} \n`);
    setStatusMessage(`Worker error: ${error.message}`);
    throw error;
  };

  // First load
  useEffect(() => {
    setStatusMessage("Loading icepool engine");
    const run = async () => {
      // Web workers without comlink
      workerRef.current = new Worker(new URL('./fightbird.worker.js', import.meta.url),);
      workerRef.current.onmessage = messageReceived
      workerRef.current.onerror = workerError
      workerRef.current.postMessage({command: 'init'});
    }
    run();
  }, []);

  useEffect(() => {
    rollDice();
  }, [
    redA, orangeA, yellowA, greenA, blueA, blackA, hitA, blockA, expertiseA,
    redB, orangeB, yellowB, greenB, blueB, blackB, hitB, blockB, expertiseB
  ]);


  const rollDice = async () => {
    // get result from worker
    let parameters = {
      a: {red: redA, yellow: yellowA, orange: orangeA, green: greenA, blue: blueA, black: blackA, hit: hitA, block: blockA, expertise: expertiseA},
      b: {red: redB, yellow: yellowB, orange: orangeB, green: greenB, blue: blueB, black: blackB, hit: hitB, block: blockB, expertise: expertiseB}
    }
    await workerRef?.current?.postMessage?.({command: 'calculate', data: parameters})
  };


  return (
    <>
      <CssBaseline/>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <CardHeader title='Attacker'/>
              <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "flex-start"}}>
                <FightbirdRatingInput value={redA} setValue={setRedA} color='red'/>
                <FightbirdRatingInput value={orangeA} setValue={setOrangeA} color='orange'/>
                <FightbirdRatingInput value={yellowA} setValue={setYellowA} color='yellow'/>
                <FightbirdRatingInput value={greenA} setValue={setGreenA} color='green'/>
                <FightbirdRatingInput value={blueA} setValue={setBlueA} color='blue'/>
                <FightbirdRatingInput value={blackA} setValue={setBlackA} color='black'/>
                <FormControlLabel
                  control={<Checkbox
                    checked={expertiseA}
                    onChange={(event) => setExpertiseA(event.target.checked)}
                  />}
                  label="Expertise"
                  // value="Expertise"
                  labelPlacement="left"
                />
                <Typography>Automatic hits</Typography>
                <FightbirdRatingInput value={hitA} setValue={setHitA} max={5} color='darkgrey'/>
                <Typography>Automatic blocks</Typography>
                <FightbirdRatingInput value={blockA} setValue={setBlockA} max={5} color='darkgrey'/>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card>
              <CardHeader title='Defender'/>
              <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "flex-start"}}>
                <FightbirdRatingInput value={redB} setValue={setRedB} color='red'/>
                <FightbirdRatingInput value={orangeB} setValue={setOrangeB} color='orange'/>
                <FightbirdRatingInput value={yellowB} setValue={setYellowB} color='yellow'/>
                <FightbirdRatingInput value={greenB} setValue={setGreenB} color='green'/>
                <FightbirdRatingInput value={blueB} setValue={setBlueB} color='blue'/>
                <FightbirdRatingInput value={blackB} setValue={setBlackB} color='black'/>
                <FormControlLabel
                  control={<Checkbox
                    checked={expertiseB}
                    onChange={(event) => setExpertiseB(event.target.checked)}
                  />}
                  label="Expertise"
                  // value="Expertise"
                  labelPlacement="left"
                />
                <Typography>Automatic hits</Typography>
                <FightbirdRatingInput value={hitB} setValue={setHitB} max={5} color='darkgrey'/>
                <Typography>Automatic blocks</Typography>
                <FightbirdRatingInput value={blockB} setValue={setBlockB} max={5} color='darkgrey'/>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Attacker wounds caused"/>
              <CardContent>
                <WarcrowResultTable rows={icepoolResult?.attacker} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Defender wounds caused"/>
              <CardContent>
                <WarcrowResultTable rows={icepoolResult?.defender} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography>Status</Typography>
            <Typography>{statusMessage}</Typography>
            <Typography>
              Alpha software! I'm not responsible for setting your PC on fire :) Please report bugs or feedback
              to Khepri at Discord or <Link href="https://github.com/alexrecarey/fightbird">at Github</Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>)
}

export default App


