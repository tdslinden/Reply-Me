export async function handler(event, context) {
  const { emotionText, personality, emotionType } = JSON.parse(event.body);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a ${personality}.` },
          {
            role: "user",
            content: `I am feeling ${emotionType} and wrote: "${emotionText}".`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      //   body: JSON.stringify({ message: data.choices[0].text.trim() }),
      body: JSON.stringify({ message: data.choices[0].text }),
      //   body: JSON.stringify({ message: "Hello" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `There was an error processing your request. Error: ${error.message}`,
      }),
    };
  }
}
