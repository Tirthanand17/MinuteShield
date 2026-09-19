declare const Buffer: {
  from(input: string, encoding?: string): { toString(encoding?: string): string };
};
declare module '@actions/core' {
  export function notice(message: string): void;
  export function warning(message: string): void;
  export function getInput(name: string, options?: { required?: boolean }): string;
  export function setOutput(name: string, value: string): void;
  export function setFailed(message: string): void;
  export const summary: { addRaw(value: string): any; write(): Promise<any> };
}
declare module '@actions/github' {
  export const context: any;
  export function getOctokit(token: string): any;
}
declare module 'yaml' {
  export function parse(text: string): any;
}
