import 'react'
import {useState, useEffect, useRef} from 'react'
import {Container, CssBaseline, Grid, Card, CardContent, CardHeader, Typography, Checkbox, FormControlLabel, Link} from '@mui/material'
import WarcrowDieInput from './WarcrowDieInput.jsx'
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
  const [expertiseA, setExpertiseA] = useState(false)

  // Inputs Player B
  const [redB, setRedB] = useState(0);
  const [orangeB, setOrangeB] = useState(0);
  const [yellowB, setYellowB] = useState(0);
  const [greenB, setGreenB] = useState(0);
  const [blueB, setBlueB] = useState(0);
  const [blackB, setBlackB] = useState(0);
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
  }, [redA, orangeA, yellowA, greenA, blueA, blackA, redB, orangeB, yellowB, greenB, blueB, blackB, expertiseA, expertiseB]);


  const rollDice = async () => {
    // get result from worker
    let parameters = {
      a: {red: redA, yellow: yellowA, orange: orangeA, green: greenA, blue: blueA, black: blackA, expertise: expertiseA},
      b: {red: redB, yellow: yellowB, orange: orangeB, green: greenB, blue: blueB, black: blackB, expertise: expertiseB}
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
                <WarcrowDieInput value={redA} setValue={setRedA} color='red'/>
                <WarcrowDieInput value={orangeA} setValue={setOrangeA} color='orange'/>
                <WarcrowDieInput value={yellowA} setValue={setYellowA} color='yellow'/>
                <WarcrowDieInput value={greenA} setValue={setGreenA} color='green'/>
                <WarcrowDieInput value={blueA} setValue={setBlueA} color='blue'/>
                <WarcrowDieInput value={blackA} setValue={setBlackA} color='black'/>
                <FormControlLabel
                  control={<Checkbox
                    checked={expertiseA}
                    onChange={(event) => setExpertiseA(event.target.checked)}
                  />}
                  label="Expertise"
                  // value="Expertise"
                  labelPlacement="left"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card>
              <CardHeader title='Defender'/>
              <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "flex-start"}}>
                <WarcrowDieInput value={redB} setValue={setRedB} color='red'/>
                <WarcrowDieInput value={orangeB} setValue={setOrangeB} color='orange'/>
                <WarcrowDieInput value={yellowB} setValue={setYellowB} color='yellow'/>
                <WarcrowDieInput value={greenB} setValue={setGreenB} color='green'/>
                <WarcrowDieInput value={blueB} setValue={setBlueB} color='blue'/>
                <WarcrowDieInput value={blackB} setValue={setBlackB} color='black'/>
                <FormControlLabel
                  control={<Checkbox
                    checked={expertiseB}
                    onChange={(event) => setExpertiseB(event.target.checked)}
                  />}
                  label="Expertise"
                  // value="Expertise"
                  labelPlacement="left"
                />
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
            <Typography>Alpha software! I'm not responsible for setting your PC on fire :) Please report bugs and errors
            to Khepri at Discord or <Link href="https://github.com/alexrecarey/fightbird">at Github</Link></Typography>
          </Grid>
        </Grid>
      </Container>
    </>)
}

export default App


