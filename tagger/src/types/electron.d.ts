export {};

declare global {
  interface Window {
    api: {
      readPrototypeJSONFromFile: () => any; // you can type this better later
    };
  }
}