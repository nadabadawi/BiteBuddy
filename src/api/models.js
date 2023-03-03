import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.REACT_APP_APIKey,
});

const api = new OpenAIApi(config);

export const generateMeal = async ({
  BMI,
  preferences,
  allergies,
  gender,
  goal,
}) => {
  // const prompt = `
  //   I want you to act as my personal nutritionist. I will tell you about my dietary preferences, allergies, my BMI, gender and target so that you know and determine my calories intake, and you will suggest a one-week meal plan specifying food of each day for me to try that will cause me to reach my target. You should only reply with the meal plan you recommend, including the quantities and the nutritional facts of each meal, and nothing else.

  //   After generating the meal plan for each day, check if the total calories match the following criteria based on the person's input:
    
  //   If the person's goal is to gain weight, they should consume around 3000-3500 total calories per day.
  //   If the person's goal is to maintain weight, they should consume around 2000-2500 total calories per day.
  //   If the person's goal is to lose weight, they should consume around 1500-2000 total calories per day.
  //   If the total calories are too high or too low for any day, adjust the quantities or replace some foods with lower or higher calorie options until all criteria are met. Do not go below or above these ranges as they are based on health recommendations.
    
  //   The meal plan should be output in the format of a csv. In the table you must output the following columns with the same exact names without any modifications: Day, Meal, Calories, Food, Quantity, Carbs, Fats, Protein. Make sure to provide the meal plan for the whole week and not just one day. Don't return any row with empty values.
    
  //   My first request is: 'BMI: ${BMI}; Preferences: ${preferences}; Allergies: ${allergies}; Gender: ${gender}; Goal: ${goal} weight;'                      
  //   `;
  let calories = "0";
  if(goal === "gain") {
    calories = "3000 - 3500 per day";
  } else if(goal === "maintain") {
    calories = "2000 - 2500 per day";
  } else if(goal === "lose") {
    calories = "1500 - 2000 per day";
  }
  const prompt = `
  I want you to act as my personal nutritionist. I will tell you about my dietary preferences, allergies, my BMI, gender and target and my daily caloric intake, and you will suggest a one-week meal plan specifying food of each day for me to try that will cause me to reach my target and satisfy my calories. You should only reply with the meal plan you recommend, including the quantities and the nutritional facts of each meal, and nothing else.

The meal plan should be output in the format of a csv. In the table you must output the following columns with the same exact names without any modifications: Day, Meal, Calories, Food, Quantity, Carbs, Fats, Protein. Make sure to provide the meal plan for the whole week and not just one day. Don't return any row with empty values.

Here are some constraints and penalties for this task:

- If the total calories for any day are too high or too low according to the criteria based on the person's input goal then deduct 10 points from your final score.
- If any row has empty values then deduct 5 points from your final score.
- If any column name is modified then deduct 5 points from your final score.

Your final score should be as high as possible. My first request is: 'BMI: ${BMI}; Preferences: ${preferences}; Allergies: ${allergies}; Gender: ${gender}; Goal: ${goal} weight; Calories: ${calories}' 
  `
  //   return null;
  console.log(prompt)
  return await api.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 2000,
  });
};

export const generatRecipe = async ({ food, quantity }) => {
  return await api.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `
        I want you to act as my personal chef. 
        I will tell you about a meal with its quantities, and you will tell me the exact recipe for me to cook it.
        You should only reply with the recipe, and nothing else. The recipe should include the exact ingredients needed and a numbered list of steps to follow. 
        Do not write explanations. My first request is ${food}. Quantity: ${quantity}
        `,
      },
    ],
    max_tokens: 2000,
  });
};

export const generateImage = async ({ food }) => {
  return await api.createImage({
    prompt: `Image of ${food}`,
    n: 1,
    size: "256x256",
  });
};

export const converse = async ({ newMessage, oldMessages }) => {
  let prompt = `You are an NLP conversational model acting as a personal coach/nutritionist. Call yoursef Bite Buddy. You are having a conversation with a user who wants to improve their eating habits and live a healthier lifestyle. Provide guidance and support by answering the newest message from the users. Try to make your answers concise. If the users asks you a question that you don't know the answer to, you can say "I don't know" or "I'm not sure".\n If the user doesn't need your help anymore, say "Goodbye for now. Keep up the good work, and feel free to come back anytime you need some guidance or motivation"\n`;

  if (oldMessages && oldMessages.length > 0) {
    prompt += `Your conversation history:\n`;
    oldMessages.forEach((message) => {
      const role = message.author == "them" ? "Bite Buddy" : "user";
      prompt += `
            ${role}: ${message.data.text}\n`;
    });

}

prompt += `The user says: ${newMessage}`
prompt += `Don't add the 'Bite Buddy:' to your response. Just write the message.\n`
//   console.log("PROMPT:", newMessage)

//   return ""
  const response = await api.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 2000,
  });
  return response.data.choices[0].message.content;
};

const modelsApis = {
  generateMeal,
  generatRecipe,
  generateImage,
};

export default modelsApis;
