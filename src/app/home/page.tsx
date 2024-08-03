"use client";

import React from "react";
import NoteDoc from "@/components/NoteDoc";
import NoteListSidebar from "@/components/NoteListSidebar";
import { NotesContextProvider } from "@/context/NotesContext";
import { SuggestionsContextProvider } from "@/context/SuggestionsContext";
import { Stack } from "@mui/material";
import SuggestionBar from "@/components/SuggestionsBar";

const Home = () => {
	return (
		<Stack>
			<SuggestionsContextProvider>
				<NotesContextProvider>
					<Stack direction="row">
						<NoteListSidebar />
						<NoteDoc />
						<SuggestionBar />
					</Stack>
				</NotesContextProvider>
			</SuggestionsContextProvider>
		</Stack>
	);
};

export default Home;
