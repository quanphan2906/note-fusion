// theme.js
import { createTheme } from "@mui/material/styles";

export const palette = {
	paperHover: "#e5e5e5",
};

const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
		error: {
			main: "#f44336",
		},
		warning: {
			main: "#ff9800",
		},
		info: {
			main: "#2196f3",
		},
		success: {
			main: "#4caf50",
		},
		background: {
			default: "#ffffff",
			paper: "#f5f5f5",
		},
		text: {
			primary: "#000000",
			secondary: "#525252",
		},
	},
	typography: {
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
		h1: {
			fontSize: "2.5rem",
		},
		h2: {
			fontSize: "2rem",
		},
		body1: {
			fontSize: "1rem",
		},
		body2: {
			fontSize: "0.9rem",
		},
	},
	// Add more customizations if needed
});

export default theme;
