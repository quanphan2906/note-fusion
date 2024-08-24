import React from "react";
import {
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	ListItem,
	Typography,
	IconButton,
	Stack,
} from "@mui/material";
import { useNotesContext } from "@/context/NotesContext";
import { palette } from "@/app/theme";
import { ArticleOutlined, NoteAdd } from "@mui/icons-material";
import { useSuggestionsContext } from "@/context/SuggestionsContext";

const drawerWidth = 260;

const NoteListSidebar = () => {
	const { notes, currentNote, createNewNote, setNoteIdOnUrl, titleCopy } =
		useNotesContext();
	const { setSuggestions } = useSuggestionsContext();

	const handleCurrentNoteChange = (noteId: string) => {
		setNoteIdOnUrl(noteId);
		setSuggestions([]);
	};

	return (
		<Drawer
			variant="permanent"
			anchor="left"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerWidth,
					boxSizing: "border-box",
				},
			}}
		>
			<List>
				<ListItem sx={{ display: "flex", justifyContent: "flex-end" }}>
					<IconButton color="text.secondary" onClick={createNewNote}>
						<NoteAdd />
					</IconButton>
				</ListItem>
				{notes.map((note) => (
					<React.Fragment key={note.id}>
						<ListItem sx={{ padding: 0 }}>
							<ListItemButton
								onClick={() => handleCurrentNoteChange(note.id)}
								sx={{
									"&:hover": {
										backgroundColor: palette.paperHover,
									},
									borderRadius: "4px",
									paddingTop: "4px",
									paddingBottom: "4px",
									paddingLeft: "16px",
									marginLeft: "8px",
									marginRight: "8px",
								}}
							>
								<ListItemText
									primary={
										<Stack direction="row" spacing={1} alignItems={"center"}>
											<ArticleOutlined fontSize="small" fontWeight={200} />
											<Typography variant="body1" color="text.secondary">
												{note.id === currentNote?.id ? titleCopy : note.title}
											</Typography>
										</Stack>
									}
								/>
							</ListItemButton>
						</ListItem>
					</React.Fragment>
				))}
			</List>
		</Drawer>
	);
};

export default NoteListSidebar;
