# AI Auto Comment · An OpenAI-Powered Documentation Extension

Easily generate JSDoc or regular code comments with this OpenAI-driven extension.

![](/demo.gif)

 Currently supports TypeScript and Javascript.

### Quick Setup
1. Provide your OpenAI key in the settings.
2. double-check you're cool with the model being "gpt-4-1106-preview" (it's the default). See [OpenAI's Site](https://platform.openai.com/docs/models) for other values.

If you don't already have an OpenAI key, you'll have to get one from [OpenAI](https://platform.openai.com/api-keys). I'm not paying for your key, sorry.

### Usage
Select some code and right-click, choose the option "AI Auto Comment" to generate a comment above your selection.

##### How it works:
- The model will be prompted with your selection, and will generate a comment based on that. See settings for how to adjust this prompt, and other settings.
- It will choose between a JSDoc and a regular comment. If you select a function it'll go with a JSDoc. If you select just some normal code, it'll generate a regular comment.
- It will auto-indent the comment/JSDoc so that it makes formatters like Prettier happy.

### Settings
You can access these by going to your VSCode settings, going to Extensions, and finding this one. If you're a JSON fan, here's the setting keys:
- **ai-auto-comment.apiKey** - Your OpenAI API key.
- **ai-auto-comment.prompt** - The prompt given to the model. You must use empty curly braces {} to signify the where your code should be inserted inside the prompt.
- **ai-auto-comment.model** - The model to use for your generation. See [OpenAI's Site](https://platform.openai.com/docs/models) for more options.
- **ai-auto-comment.maxTokens** - The maximum number of tokens to generate. Increase this if you want to generate more text. Decrease this if you want to save more money.
- **ai-auto-comment.allowSingleLineSelection** - Whether to allow single-line selections for generating docs. Usually it's best to give the AI more than one line but enabling this can be useful for small functions.
