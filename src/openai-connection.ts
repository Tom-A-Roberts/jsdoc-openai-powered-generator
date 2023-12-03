import OpenAI from "openai";

type ParseResult = {
  prompt: string | null;
  error: string | null;
};

export const parsePromptAndInsertInput = (prompt: string, input: string): ParseResult => {
  // Use {} to signify where the input should be inserted
  const inputPlaceholder = "{}";

  // Find the placeholder index
  const inputPlaceholderIndex = prompt.indexOf(inputPlaceholder);

  // Check if placeholder is present
  if (inputPlaceholderIndex === -1) {
    return {
      prompt: null,
      error: `Could not find input placeholder "${inputPlaceholder}" in prompt`,
    };
  }

  // Replace the placeholder with the input and create the new prompt
  const newPrompt = prompt.replace(inputPlaceholder, input);

  return {
    prompt: newPrompt,
    error: null,
  };
};

export async function getAIResponse(apiKey: string, input: string, prompt: string, model: string) {
  const openai = new OpenAI({ apiKey });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a typescript assistant. You are to write a single JSdoc or a single comment. You only respond with the text itself, no other text or information.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  console.log(messages);

  try {
    const res = await openai.chat.completions.create({
      messages,
      model: model,
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
