import { useNotesContext } from "@/context/NotesContext";
import { useQueryState } from "nuqs";

export const useNoteIdQueryState = () => {
	const [noteId, setNoteId] = useQueryState("noteId");
	const { handleSetCurrentNote } = useNotesContext();
	const _setNoteId = (noteId: string) => {
		setNoteId(noteId);
		handleSetCurrentNote(noteId);
	};

	return [noteId, _setNoteId] as const;
};
