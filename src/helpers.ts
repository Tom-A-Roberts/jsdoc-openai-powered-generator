import * as vscode from "vscode";

export const findSelectedBlockFromSelection = (
  fileText: string,
  selection: vscode.Selection
): {
  contents: string;
  startLineIndex: number;
  endLineIndex: number;
} | null => {
  const lines = fileText.split("\n");

  let startLineIndex = selection.start.line;
  let endLineIndex = selection.end.line;

  if (startLineIndex === endLineIndex) {
    if (lines[startLineIndex].trim() === "") {
      return null;
    }

    return { contents: lines[startLineIndex], startLineIndex, endLineIndex };
  }

  const linesInDocument = lines.length;

  while (lines[startLineIndex].trim() === "" && startLineIndex < endLineIndex && startLineIndex < linesInDocument) {
    startLineIndex++;
  }

  if (startLineIndex === endLineIndex) {
    return null;
  }

  while (lines[endLineIndex].trim() === "" && endLineIndex > startLineIndex && endLineIndex > 0) {
    endLineIndex--;
  }

  if (startLineIndex === endLineIndex) {
    return null;
  }

  const blockSelected = lines.slice(startLineIndex, endLineIndex + 1);

  return { contents: blockSelected.join("\n"), startLineIndex, endLineIndex };
};

export const cleanAIResponse = (_response: string): string => {
  let response = _response;
  response = response.trim();

  // Trim away common prefixes that gpt likes to add
  if(response.startsWith("```") && response.endsWith("```")) {
    response = response.slice(3, -3).trim();
  }
  const lowerCaseResponse = response.toLowerCase();
  if(lowerCaseResponse.startsWith("jsdoc")) {
    response = response.slice(5).trim();
  }
  if(lowerCaseResponse.startsWith("javascript")) {
    response = response.slice(10).trim();
  }
  if(lowerCaseResponse.startsWith("typescript")) {
    response = response.slice(10).trim();
  }
  if(lowerCaseResponse.startsWith("[code]")) {
    response = response.slice(6).trim();
  }
  if(lowerCaseResponse.startsWith("[jsdoc]")) {
    response = response.slice(7).trim();
  }
  if(lowerCaseResponse.startsWith("[comment]")) {
    response = response.slice(9).trim();
  }
  if(lowerCaseResponse.startsWith("[jsdoc/comment]")) {
    response = response.slice(15).trim();
  }

  return response;
}

/**
* Prepends the indentation of the first non-empty line from a code block to each line of a provided comment string.
*
* @param codeBlock The string representing the block of code.
* @param commentStr The string representing the comment to be indented.
* @returns The comment string with each line indented to match the code block's first non-empty line indentation.
*/
export const indentCommentToCode = (codeBlock: string, commentStr: string): string => {
  // Find the indentation of the first non-empty line in the code block
  const indentMatch = codeBlock.match(/^(?!\s*$)\s*/);
  const indent = indentMatch ? indentMatch[0] : '';

  // Split the comment string into lines
  const commentLines = commentStr.split('\n');

  // Prepend the same indentation to each line of the comment for consistency
  let indentedComment = commentLines.map(line => `${indent}${line}`).join('\n');
  // if indentedComment doesn't end in a newline, add one
  if (indentedComment[indentedComment.length - 1] !== "\n") {
    indentedComment += "\n";
  }
  return indentedComment;
}