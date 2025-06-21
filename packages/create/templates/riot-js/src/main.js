import App from "./app.riot";
import { component } from "riot";
import "./style.css";

const mountApp = component(App);

mountApp(document.querySelector("#app"));
