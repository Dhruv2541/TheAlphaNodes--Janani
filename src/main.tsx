import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global runtime error capture (persist to localStorage so we can inspect on mobile)
if (typeof window !== 'undefined') {
	window.addEventListener('error', (ev) => {
		try {
			const payload = { message: ev.message, filename: (ev as any).filename, stack: (ev as any).error?.stack || null, time: new Date().toISOString() };
			localStorage.setItem('runtimeError', JSON.stringify(payload));
			// also log to console for desktop
			console.error('Captured runtime error', payload);
		} catch (e) {}
	});
	window.addEventListener('unhandledrejection', (ev) => {
		try {
			const reason = (ev as any).reason;
			const payload = { message: reason?.message || String(reason), stack: reason?.stack || null, time: new Date().toISOString() };
			localStorage.setItem('runtimeError', JSON.stringify(payload));
			console.error('Captured unhandledrejection', payload);
		} catch (e) {}
	});
}

createRoot(document.getElementById("root")!).render(<App />);
