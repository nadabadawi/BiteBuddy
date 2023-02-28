// create BMI component
import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

const PreferencesAllergies = ({ state, setState }) => {
  // console.log(state)
  const allergies = state.allergies// ["dairy", "gluten", "peanut", "soy", "tree nut", "wheat"];
  console.log("ALLERGIES: ", allergies)
  return (
    <div>
      <h1>Preferences Allergies</h1>
      <Autocomplete
        multiple
        id="tags-standard"
        options={allergies}
        // value={state.allergies}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        filterSelectedOptions
        onChange={(event, newValue) => {
          console.log("NEW VALUE: ",newValue);
          // setState({ ...state, allergies: [...state.allergies, String(newValue)] });
        }}
        filterOptions={(options, params) => {
          console.log("OPTIONS: ", options);
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
          console.log("OPTION11111: ", option);
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
          <TextField
            {...params}
            variant="standard"
            label="Allergies"
            placeholder="Favorites"
          />
        )}
      />
    </div>
  );
};
export default PreferencesAllergies;
