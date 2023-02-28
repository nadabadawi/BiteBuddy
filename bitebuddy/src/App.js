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

import { CircularProgress, LinearProgress } from "@mui/material";

import { OpenAIApi, Configuration } from "openai"
import Loading from "./pages/Loading";

const config = new Configuration({ apiKey: "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" })
function App() {
  // create steps for stepper
  const steps = ["Get BMI", "Food Preferences & Allergies", "Meal Plan"];

  const [activeStep, setActiveStep] = React.useState(2);




  // const [formState, setFormState] = React.useState({
  //   age: 0,
  //   height: 0,
  //   weight: 0,
  //   gender: "",
  //   mode: "",
  //   loseOrGain: "",
  //   allergies: [],
  //   preferences: [],
  // });

  const [formState, setFormState] = React.useState({
    age: "21",
    height: "180",
    weight: "80",
    gender: "male",
    mode: "vegan",
    loseOrGain: "lose",
    allergies: ["milk"],
    preferences: ["chicken"],
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
        return <PreferencesAllergies
          state={formState}
          setState={setFormState}
        />
      case 2:
        return <MealPlan
          mealPlan={mealPlan}

        />;
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

        <Loading
          loading={loading}
        />
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
                  display: activeStep === steps.length - 2 ? "none" : "block",
                }}
              >
                NEXT
              </Button>
              <Button
                variant="contained"
                onClick={async () => {
                  setLoading(true)
                  const BMI = formState.weight / (formState.height * formState.height);
                  const api = new OpenAIApi(config)

                  try {

                    const result = await api.createCompletion({
                      model: "text-davinci-003",
                      prompt: `
                      I want you to act as my personal nutritionist. 
                      I will tell you about my dietary preferences and allergies and my BMI so that you know my calories intake, and you will suggest a one week meal plan specifying food of each day for me to try that will cause me to ${formState.loseOrGain} my weight.
                      You should only reply with the meal plan you recommend including the quantities and the nutritional facts of each meal, and nothing else. 
                      The meal plan should be output in the format of a csv. In the table you must output the following columns: Day, Meal, Food, Quantity, Calories, Protein, Carbs, Fats. Do not write explanations. 
                
                      
                      My first request is 'BMI: ${BMI}, Preferences: ${formState.preferences.join(", ")}, Allergies: ${formState.allergies.join(", ")}'
                      
                      `,
                      max_tokens: 3900,


                    })
                    setMealPlan(result.data.choices[0].text)
                    handleNext()
                  }
                  catch (e) {
                    console.log(e)
                  }
                  finally {
                    setLoading(false)
                  }




                }}
                sx={{
                  mt: 3,
                  ml: 1,
                  display: activeStep === steps.length - 2 ? "block" : "none",
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
