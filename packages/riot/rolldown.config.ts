import pkg from "./package.json";
import { defineConfig } from "rolldown";
import { inputGlob, outputs, packageDependencies } from "../../rolldown.config";

export default defineConfig({
  input: inputGlob("src/**/*.js"),
  external: packageDependencies(pkg),
  output: outputs,
});
