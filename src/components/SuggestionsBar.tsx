import React from "react";
import { Box, Drawer, Stack, Typography, useTheme } from "@mui/material";
import { useSuggestionsContext } from "@/context/SuggestionsContext";
import { useNotesContext } from "@/context/NotesContext";

const SuggestionBar = () => {
	const { suggestions, setSuggestions } = useSuggestionsContext();
	const { setNoteIdOnUrl } = useNotesContext();

	const theme = useTheme();

	const handleSuggestionClick = (noteId: string) => {
		setNoteIdOnUrl(noteId);
		setSuggestions([]);
	};

	return (
		<Drawer variant="permanent" anchor="right">
			<Stack
				direction="column"
				spacing={2}
				sx={{ width: 260, backgroundColor: theme.palette.background.paper }}
				padding={2}
			>
				{suggestions.map(({ noteId, noteTitle, content }, index) => (
					<Box
						key={index}
						onClick={() => handleSuggestionClick(noteId)}
						sx={{
							cursor: "pointer",
							background: theme.palette.background.default,
							padding: 2,
							borderRadius: "4px",
							border: "1px solid #ccc",
						}}
					>
						<Typography variant="body1" fontWeight={"bold"} sx={{ mb: 1 }}>
							{noteTitle}
						</Typography>
						<Typography variant="body2">{content}</Typography>
					</Box>
				))}
			</Stack>
		</Drawer>
	);
};

export default SuggestionBar;
