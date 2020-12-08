import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import HackathonSelector from './HackathonSelector';
import Tags from "../ProfileEdit/Tags";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ['Want to team up for a Hackathon ?', 'Specify Similary Check options'];
}



export default function SearchBar() {
  const [hackFilter, setHackFilter] = React.useState("yes");
  const [stackFilter,setStackFilter] = React.useState("yes");
  const [reqStack,setReqStack] = React.useState([]);

  function changeHackFilter(e){
      setHackFilter(e.target.value);
  }
  function changeStackFilter(e){
    setStackFilter(e.target.value);
}

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (<div>
                <RadioGroup aria-label="Hack-Filter" name="Hack-Filter" value={hackFilter} onChange={changeHackFilter}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <HackathonSelector disable={hackFilter==="no"?true:false} hackChoice={hackChoice} setHackChoice={setHackChoice}/>
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </div>);
      case 1:
        return (<div>
          <RadioGroup aria-label="Stack-Filter" name="Stack-Filter" value={stackFilter} onChange={changeStackFilter}>
            <FormControlLabel value="yes" control={<Radio />} label="Similar to your Tech Stack ?" />
            <FormControlLabel value="no" control={<Radio />} label="Specify a Tech Stack" />
            <Tags tags={reqStack} setTags={setReqStack} disable={stackFilter==="yes"?true:false}  />
          </RadioGroup>
        </div>);
      default:
        return 'Unknown step';
    }
  }


  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [hackChoice, setHackChoice] = React.useState({name:""});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  //console.log(hackChoice);
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Search' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Fetching Results... </Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}