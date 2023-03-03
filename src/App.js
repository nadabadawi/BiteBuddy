import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

import Loading from "./pages/Loading";
import ChatBot from "./pages/Chatbot/ChatBot";
import { generateMeal } from "./api/models";

import AppBar from "./pages/AppBar";
import { Typography } from "@mui/material";

function App() {
  // create steps for stepper
  const steps = ["Get BMI", "Food Preferences & Allergies"]; //, "Meal Plan"];

  const [activeStep, setActiveStep] = React.useState(0);

  const [formState, setFormState] = React.useState({
    age: 0,
    height: 0,
    weight: 0,
    gender: "",
    mode: "",
    loseOrGain: "",
    allergies: [],
    preferences: [],
  });

  const [mealPlan, setMealPlan] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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
        return <BMI state={formState} setState={setFormState} />;
      case 1:
        return (
          <PreferencesAllergies state={formState} setState={setFormState} />
        );
      // case 2:
      //   return <MealPlan mealPlan={mealPlan} />;
      // default:
      //   throw new Error("Unknown step");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}

      <AppBar />
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Loading loading={loading} />
        {activeStep < steps.length && (
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
                    display: activeStep >= steps.length - 1 ? "none" : "block",
                  }}
                >
                  NEXT
                </Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    setLoading(true);
                    const height = formState.height / 100;
                    const BMI = formState.weight / (height * height);

                    try {
                      const preferences = formState.preferences
                        .map((obj) => obj.inputValue)
                        .join(", ");
                      const allergies = formState.allergies
                        .map((obj) => obj.inputValue)
                        .join(", ");

                      const result = await generateMeal({
                        BMI,
                        gender: formState.gender,
                        preferences,
                        allergies,
                        goal: formState.loseOrGain,
                      });

                      setMealPlan(result.data.choices[0].message.content);
                      handleNext();
                    } catch (e) {
                      console.log(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
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
        )}
        {activeStep === steps.length && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom mt={5}>
              You Meal Plan is ready!
            </Typography>
            <Button
              onClick={() => setActiveStep(0)}
              variant="contained"
              sx={{
                mt: 3,
                ml: 1,
                mb: 5,
              }}
            >
              RESET
            </Button>
            <MealPlan mealPlan={mealPlan} />
          </Box>
        )}
        <ChatBot />
      </Container>
    </ThemeProvider>
  );
}

export default App;
