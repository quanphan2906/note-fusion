"use client";

import React from "react";
import NoteDoc from "@/components/NoteDoc";
import NoteListSidebar from "@/components/NoteListSidebar";
import { NotesContextProvider } from "@/context/NotesContext";
import { SuggestionsContextProvider } from "@/context/SuggestionsContext";
import { CssBaseline, Stack, ThemeProvider } from "@mui/material";
import SuggestionBar from "@/components/SuggestionsBar";
import theme from "../theme";

const Home = () => {
	return (
		<Stack sx={{ height: "100%" }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SuggestionsContextProvider>
					<NotesContextProvider>
						<Stack direction="row" sx={{ height: "100%" }}>
							<NoteListSidebar />
							<NoteDoc />
							<SuggestionBar />
						</Stack>
					</NotesContextProvider>
				</SuggestionsContextProvider>
			</ThemeProvider>
		</Stack>
	);
};

export default Home;
