import App from "./app.riot";
import { component } from "@your-riot/riot";
import "./style.css";

const mountApp = component(App);

mountApp(document.querySelector("#app"));
