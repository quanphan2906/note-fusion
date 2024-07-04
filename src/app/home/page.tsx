"use client";

import React from "react";
import NoteDoc from "@/components/NoteDoc";
import NoteListSidebar from "@/components/NoteListSidebar";
import { NotesContextProvider } from "@/context/NotesContext";
import { SuggestionsContextProvider } from "@/context/SuggestionsContext";
import { Stack } from "@mui/material";

const Home = () => {
	return (
		<div className="h-screen">
			<SuggestionsContextProvider>
				<NotesContextProvider>
					<Stack direction="row">
						<NoteListSidebar />
						<NoteDoc />
					</Stack>
				</NotesContextProvider>
			</SuggestionsContextProvider>
		</div>
	);
};

export default Home;
