// create BMI component
import { Alert, Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Box } from "@mui/system";

const filter = createFilterOptions();

const PreferencesAllergies = ({ state, setState }) => {
  // console.log(state)
  const allergies = state.allergies// ["dairy", "gluten", "peanut", "soy", "tree nut", "wheat"];
  const preferences = state.preferences;
  const handleAllergiesChange = (event, newValue) => {
    setState({ ...state, allergies: newValue });
  };

  const handlePreferencesChange = (event, newValue) => {
    setState({ ...state, preferences: newValue });
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        rowGap: "0.6rem",

      }
      }

    >
      <h1>Preferences - Allergies</h1>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Mode</InputLabel>

        <Select value={state.mode} onChange={(e) => setState({ ...state, mode: e.target.value })}
          label="Mode"
          sx={{ width: "100%" }}


        >
          <MenuItem value="vegan">Vegan</MenuItem>
          <MenuItem value="vegetarian">Vegetarian</MenuItem>
          <MenuItem value="pescatarian">Pescatarian</MenuItem>
          <MenuItem value="omnivore">Omnivore</MenuItem>
        </Select>
      </FormControl>


      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Lose or Gain</InputLabel>
        <Select value={state.loseOrGain} onChange={(e) => setState({ ...state, loseOrGain: e.target.value })}
          label="Lose or Gain"
        >
          <MenuItem value="lose">Lose</MenuItem>
          <MenuItem value="gain">Gain</MenuItem>
          <MenuItem value="maintain">Maintain</MenuItem>

        </Select>
      </FormControl>
      <br />
      <br />







      <Autocomplete
        multiple
        id="preferences-standard"
        value={preferences}
        options={preferences}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys


        filterSelectedOptions
        onChange={handlePreferencesChange}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.title
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
            // filtered.push(inputValue);
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          // console.log("OPTION11111: ", option);
          // return option;
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              variant="standard"
              label="Preferences"
              placeholder="Preferences"
              helperText="Tip: Click on the preferences to add or remove them"
            />
          </>
        )}
      />

      <Autocomplete
        multiple
        id="tags-standard"
        options={allergies}
        value={allergies}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        filterSelectedOptions
        onChange={handleAllergiesChange}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option.title
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              title: `Add "${inputValue}"`,
            });
            // filtered.push(inputValue);
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          // console.log("OPTION11111: ", option);
          // return option;
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              variant="standard"
              label="Allergies"
              placeholder="Allergies"
              helperText="Tip: Click on the allergies to add or remove them"
            />
          </>
        )}
      />
      <Alert severity="info">
        <strong>Tip:</strong> Click on the preferences or allergies to add or
        remove them
      </Alert>
    </Box>
  );
};
export default PreferencesAllergies;
