import React, { useMemo } from "react";

import MaterialReactTable from "material-react-table";
import { Box } from "@mui/system";
import {
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Modal } from "@mui/material";

import { generatRecipe, generateImage } from "../api/models";

const csv = `
Day,Meal,Food,Quantity,Calories,Protein,Carbs,Fats
Monday,Breakfast,Oatmeal,1 cup,150.3,5,27,2.5
Monday,Snack,Fruit smoothie,1 cup,122,1.9,29.8,0.4
Monday,Lunch,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7
Monday,Snack,Peanuts,1 oz,156,6,6,14
Monday,Dinner,Vegetable Soup,1 cup,63,2.5,10.5,1.5
Tuesday,Breakfast,Greek yogurt,1 cup,149,11.7,8.5,5.7
Tuesday,Snack,Carrot Sticks,1 cup,30,0.7,6.9,0.1
Tuesday,Lunch,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7
Tuesday,Snack,Apple,1 medium,95,0.4,25.1,0.2
Tuesday,Dinner,Baked Salmon,4 oz,202,19,0,14
Wednesday,Breakfast,Eggs,2 large,143,12.6,0.8,9.1
Wednesday,Snack,Almonds,1 oz,164,6,6,14
Wednesday,Lunch,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7
Wednesday,Snack,Roasted Chickpeas,1 oz,89,3.5,9,3
Wednesday,Dinner,Baked Halibut,4 oz,137,24.2,0,2
Thursday,Breakfast,Oatmeal,1 cup,150.3,5,27,2.5
Thursday,Snack,Cheese Stick,1 oz,72,5.7,0.5,5.7
Thursday,Lunch,Vegetable Sandwich,1 serving,228.3,6.3,32.3,6
Thursday,Snack,Clementine,1 medium,35,0.6,8.9,0.2
Thursday,Dinner,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7
Friday,Breakfast,Berries,1/2 cup,41.4,0.4,10.4,0.4
Friday,Snack,Popcorn, 1/2 cup,56,2.4,10,1
Friday,Lunch,Tuna Salad,1 serving,263,24.3,7.3,13.3
Friday,Snack,Walnuts,1 oz,185,4,4,18
Friday,Dinner,Veggie Chili,1 cup,267,13,40.5,5.5
Saturday,Breakfast,Scrambled Eggs,2 eggs,144,13.6,1.6,9
Saturday,Snack,Apricots,2 medium,39,0.5,9.7,0.2
Saturday,Lunch,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7
Saturday,Snack,Carrot Hummus,2 tbsp,62,0.9,7.3,3.3
Saturday,Dinner,Baked Sweet Potato,1 potato,180,3.8,41.4,0.2
Sunday,Breakfast,Sliced Avocado on Toast,1/2 avocado and 2 slices of toast,250,7.1,31.2,10.3
Sunday,Snack,Mixed Nuts,1 oz,171,4.2,4,15.4
Sunday,Lunch,Tuna Salad Sandwich,1 sandwich,337.4,22.4,33.2,13.8
Sunday,Snack,Strawberries,1 cup,53,1.1,13,0.5
Sunday,Dinner,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7 2`;

/*
  CSV format:
    **
    Calories: "150.3"
 ​
Carbs: "27"
 ​
Day: "Monday"
 ​
Fats: "2.5"
 ​
Food: "Oatmeal"
 ​
Meal: "Breakfast"
 ​
Protein: "5"
 ​
Quantity: "1 cup" */

//group by day
const CSVParse = (csv) => {
  const lines = csv.split("\n").filter((line) => line.length > 0);
  const headers = lines[0].split(",").map((s) => s.trim());
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",").map((s) => s.trim());
    for (let j = 0; j < headers.length; j++) {
      if (
        headers[j] === "Calories" ||
        headers[j] === "Carbs" ||
        headers[j] === "Fats" ||
        headers[j] === "Protein"
      ) {
        //TODO: parse to float with 2 decimal places
        obj[headers[j]] = parseFloat(currentline[j]);
      } else obj[headers[j]] = currentline[j];
    }
    data.push(obj);
  }
  return data;
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
};
const MealPlan = ({ mealPlan }) => {
  // mealPlan = csv;
  console.log(CSVParse(mealPlan));

  const data = CSVParse(mealPlan);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const [recipe, setRecipe] = React.useState(null);
  const [foodImage, setfoodImage] = React.useState(null);
  const [recipeName, setRecipeName] = React.useState(null);
  const [recipeLoading, setRecipeLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setRecipe(null);
    setRecipeName(null);
  };

  const fetchRecipe = async (food, quantity) => {
    try {
      setRecipeLoading(true);

      const img = await generateImage({ food });

      const result = await generatRecipe({ food, quantity });

      setRecipe(result.data.choices[0].message.content);
      setRecipeName(food);
      setfoodImage(img.data?.data?.[0]?.url);
    } finally {
      setRecipeLoading(false);
    }
  };
  console.log(foodImage);

  const columns = useMemo(
    () => [
      {
        header: "Day",
        accessorKey: "Day",
      },
      {
        header: "Meal",
        accessorKey: "Meal",
      },
      {
        header: "Calories",

        accessorKey: "Calories",
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return (
            <div>
              <strong>Total Calories:</strong> {cell.getValue()}
            </div>
          );
        },
      },
      {
        header: "Food",
        accessorKey: "Food",

        Cell: ({ cell, row }) => {
          return (
            <div>
              <strong>{cell.getValue()}</strong>

              <Tooltip title="View" aria-label="view">
                <IconButton
                  aria-label="view"
                  color="primary"
                  size="small"
                  onClick={() => {
                    handleOpen();
                    fetchRecipe(cell.getValue(), row.original.Quantity);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
      {
        header: "Quantity",
        accessorKey: "Quantity",
      },
      // {
      //   header: "Calories",
      //   accessorKey: "Calories",
      // },
      {
        header: "Carbs",
        accessorKey: "Carbs",
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return (
            <div>
              <strong>Total Carbs:</strong> {cell.getValue()}
            </div>
          );
        },
      },
      {
        header: "Fats",
        accessorKey: "Fats",
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return (
            <div>
              <strong>Total Fats:</strong> {cell.getValue()}
            </div>
          );
        },
      },
      {
        header: "Protein",
        accessorKey: "Protein",
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return (
            <div>
              <strong>Total Protein:</strong> {cell.getValue()}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {recipeLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Recipe of {recipeName}
              </Typography>
              <img src={foodImage} alt={recipeName} />

              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {recipe?.split("\n").map((item, i) => {
                  if (i) return <div key={i}>{item}</div>;
                  return null;
                })}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
      
        }}
      >
        <MaterialReactTable
          title="Meal Plan"
          data={data}
          columns={columns}
          enableColumnResizing
          enableGrouping
          enableStickyHeader
          enableStickyFooter
          initialState={{
            density: "compact",

            expanded: true, //expand all groups by default

            grouping: ["Day"], //an array of columns to group by by default (can be multiple)

            pagination: { pageIndex: 0, pageSize: 20 },

            // sorting: [{ id: 'Day', desc: false }], //sort by state by default
          }}
          muiToolbarAlertBannerChipProps={{ color: "primary" }}
          muiTableContainerProps={{ sx: { maxHeight: 700 } }}
          muiTablePaperProps={{
            sx: {
              width: "100%",
              //make width responsive
              minWidth: {
                xs: 300,
                sm: 500,
                md: 1500,
                
              }
            },
          }}
          //hide banner on the top that is showing the table is grouped by Day
          // muiToolbarAlertBannerProps={{ hidden: true }}
          state={{
            grouping: ["Day"], //an array of columns to group by by default (can be multiple)
          }}
        />
      </Box>
    </>
  );
};

export default MealPlan;
