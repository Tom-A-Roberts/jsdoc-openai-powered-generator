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

export const cleanAIResponse = (response: string): string => {
  // if response doesn't end in a newline, add one
  if (response[response.length - 1] !== "\n") {
    response += "\n";
  }
  return response;
}