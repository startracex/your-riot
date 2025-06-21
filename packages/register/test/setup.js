import { pathToFileURL } from "node:url";
import { register } from "node:module";

register("./dist/module/index.js", pathToFileURL("./"));
