// create BMI component
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'https://esm.sh/remark-gfm@3'
import React, { useMemo } from 'react';

import MaterialReactTable from 'material-react-table';
import { Box } from '@mui/system';


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
Sunday,Dinner,Grilled Skinless Chicken Breast,4 oz,166,31.4,0,3.7 2`

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
  const headers = lines[0].split(",");
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {

      if (headers[j] === "Calories" || headers[j] === "Carbs" || headers[j] === "Fats" || headers[j] === "Protein") {
        obj[headers[j]] = parseFloat(currentline[j])
      } else

        obj[headers[j]] = currentline[j];
    }
    data.push(obj);
  }
  return data;
};


const MealPlan = ({ mealPlan }) => {
  // console.log(CSVParse(mealPlan))

  const data = CSVParse(csv);
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

        header: 'Calories',

        accessorKey: 'Calories',
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return <div><strong>Total Calories:</strong> {cell.getValue()}</div>
        }

      },
      {
        header: "Food",
        accessorKey: "Food",
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
          return <div><strong>Total Carbs:</strong> {cell.getValue()}</div>
        } 
      },
      {
        header: "Fats",
        accessorKey: "Fats",
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return <div><strong>Total Fats:</strong> {cell.getValue()}</div>
        }

      },
      {
        header: "Protein",
        accessorKey: "Protein",
        aggregationFn: "sum",

        AggregatedCell: ({ cell }) => {
          return <div><strong>Total Protein:</strong> {cell.getValue()}</div>
        }
      },

    ],
    []);

  return (
    <div>
      <MaterialReactTable
        title="Meal Plan"
        data={data}
        columns={columns}
        enableColumnResizing

        enableGrouping

        enableStickyHeader

        enableStickyFooter

        initialState={{

          density: 'compact',

          expanded: true, //expand all groups by default

          grouping: ['Day'], //an array of columns to group by by default (can be multiple)

          pagination: { pageIndex: 0, pageSize: 20 },

          // sorting: [{ id: 'Day', desc: false }], //sort by state by default

        }}

        muiToolbarAlertBannerChipProps={{ color: 'primary' }}

        muiTableContainerProps={{ sx: { maxHeight: 700 } }}


        //hide banner on the top that is showing the table is grouped by Day
        // muiToolbarAlertBannerProps={{ hidden: true }}
        state ={{
          grouping: ['Day'], //an array of columns to group by by default (can be multiple) 
        }}
      />


    </div>
  );
};

export default MealPlan;