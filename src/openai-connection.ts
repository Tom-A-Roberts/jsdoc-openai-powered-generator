import OpenAI from "openai";

export async function testAI(apiKey: string, input: string) {
  const openai = new OpenAI({ apiKey });

  try {
    const res = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You write JSdoc comments and standard comments for typescript code. You only respond with the text itself, no other text or information.",
        },
        {
          role: "user",
          content: "### [TASK]\nWrite a jsdoc comment for the following code. Use the correct indent, reflecting the indenting used in the code snippet.\n\n### [CODE]\n```" + input + "```\n\n### [JSDOC/COMMENT]\n",
        },
      ],
      model: "gpt-3.5-turbo",
    });
    console.log(res);

    return {
      error: null,
      result: res,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
      result: null,
    };
  }
}
