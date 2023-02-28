// create BMI component
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const BMI = ({ state = {}, setState = () => {} }) => {
  return (
    <div>
      <h1>BMI</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          rowGap: "0.4rem",
        }}
      >
        <TextField
          label="Age"
          variant="outlined"
          type={"number"}
          value={state.age}
          onChange={(e) => setState({ ...state, age: e.target.value })}
        />
        <br />
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={state.gender}
            onChange={(e) => {
              setState({ ...state, gender: e.target.value });
            }}
          >
            <FormControlLabel control={<Radio />} label="Male" value="male" />
            <FormControlLabel
              control={<Radio />}
              label="Female"
              value="female"
            />
          </RadioGroup>
        </FormControl>
        <br />

        <TextField
          label="Height (cm)"
          variant="outlined"
          type={"number"}
          value={state.height}
          onChange={(e) => setState({ ...state, height: e.target.value })}
        />
        <br />

        <TextField
          label="Weight (kg)"
          variant="outlined"
          type={"number"}
          value={state.weight}
          onChange={(e) => setState({ ...state, weight: e.target.value })}
        />
      </Box>
    </div>
  );
};

export default BMI;
