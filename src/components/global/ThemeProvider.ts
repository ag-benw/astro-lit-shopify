import { LitElement, unsafeCSS } from "lit";
import tailwind from "../../styles/tailwind.global.css?inline";
const ThemeProvider = class extends LitElement {
    static styles = [unsafeCSS(tailwind)];
};
export default ThemeProvider;