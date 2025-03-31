import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Howler } from 'howler';

// Set default Howler volume
Howler.volume(0.3);

createRoot(document.getElementById("root")!).render(<App />);
