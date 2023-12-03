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

  // if response doesn't end in a newline, add one
  if (response[response.length - 1] !== "\n") {
    response += "\n";
  }
  return response;
}