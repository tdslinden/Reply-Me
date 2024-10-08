exports.handler = async function (event, context) {
  const { emotionText, personality, emotionType } = JSON.parse(event.body);
  const systemContent = `You are a ${personality}.`;
  const userContent = `I am feeling ${emotionType} and wrote: "${emotionText}".`;

  console.log(systemContent);
  console.log(userContent);
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
          { role: "system", content: systemContent },
          {
            role: "user",
            content: userContent,
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
      body: JSON.stringify({
        data: data,
        message: data.choices[0].message.content,
        
        sContent: systemContent,
        uContent: userContent,
      }),
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
};
