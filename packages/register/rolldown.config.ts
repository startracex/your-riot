import pkg from "./package.json";
import { defineConfig } from "rolldown";
import { inputGlob, outputs, packageDependencies } from "../../rolldown.config";

export default defineConfig({
  input: inputGlob("src/**/*.ts"),
  external: packageDependencies(pkg),
  output: outputs[0],
});
