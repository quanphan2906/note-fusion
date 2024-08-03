import React from "react";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useSuggestionsContext } from "@/context/SuggestionsContext";
import { useNotesContext } from "@/context/NotesContext";

const SuggestionBar = () => {
	const { suggestions } = useSuggestionsContext();
	const { setNoteIdOnUrl } = useNotesContext();

	return (
		<Stack
			direction="column"
			spacing={2}
			sx={{ width: "300px", backgroundColor: "grey" }}
		>
			{suggestions.map(({ noteId, noteTitle, content }) => (
				<Card
					key={`${noteId}-${noteTitle}`}
					onClick={() => setNoteIdOnUrl(noteId)}
					style={{ cursor: "pointer" }}
				>
					<CardHeader title={noteTitle} />
					<CardContent>{content}</CardContent>
				</Card>
			))}
		</Stack>
	);
};

export default SuggestionBar;
