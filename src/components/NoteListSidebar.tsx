import React from "react";
import {
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	Divider,
	ListItem,
	Button,
} from "@mui/material";
import { useNotesContext } from "@/context/NotesContext";

const drawerWidth = 240;

const NoteListSidebar = () => {
	const { notes, currentNote, createNewNote, setNoteIdOnUrl, titleCopy } =
		useNotesContext();

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
				{notes.map((note) => (
					<React.Fragment key={note.id}>
						<ListItemButton onClick={() => setNoteIdOnUrl(note.id)}>
							<ListItemText
								primary={note.id === currentNote?.id ? titleCopy : note.title}
							/>
						</ListItemButton>
						<Divider />
					</React.Fragment>
				))}
				<ListItem>
					<Button variant="contained" color="primary" onClick={createNewNote}>
						+ Add Note
					</Button>
				</ListItem>
			</List>
		</Drawer>
	);
};

export default NoteListSidebar;
