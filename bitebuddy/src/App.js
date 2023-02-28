import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";

import BMI from "./pages/BMI";
import PreferencesAllergies from "./pages/PreferencesAllergies";
import MealPlan from "./pages/MealPlan";

import "./App.css";

function App() {
  // create steps for stepper
  const steps = ["Get BMI", "Food Preferences & Allergies", "Meal Plan"];

  const [activeStep, setActiveStep] = React.useState(0);
  const [age, setAge] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [weight, setWeight] = React.useState(0);

  const [formState, setFormState] = React.useState({
    age: 0,
    height: 0,
    weight: 0,
    gender: "",
    allergies: [],
    preferences: [],
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#cc2c2c",
      },
      secondary: {
        main: "#a32f2d",
      },
      error: {
        main: "#cc2c2c",
      },
      background: {
        default: "#fff",
      },
    },
  });

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <PreferencesAllergies
        
        state={formState}
        setState={setFormState}
        />;
        case 1:
        return <BMI state={formState} setState={setFormState} />;
      case 2:
        return <MealPlan />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          // borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      ></AppBar>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          Making your Food Plan
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{ mt: 3, ml: 1 }}
                disabled={activeStep === 0}
              >
                BACK
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  mt: 3,
                  ml: 1,
                  display: activeStep === steps.length - 1 ? "none" : "block",
                }}
              >
                NEXT
              </Button>
              <Button
                variant="contained"
                onClick={() => {}}
                sx={{
                  mt: 3,
                  ml: 1,
                  display: activeStep === steps.length - 1 ? "block" : "none",
                }}
              >
                SUBMIT
              </Button>
            </Box>
          </>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
