import { Note } from "@/common/types/Note";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Options, parseAsString, useQueryState } from "nuqs";
import { createNote, deleteNote, getAllNotes, updateNote } from "@/services/note.service";

// extract type of context and save it to a variable
type NotesContextType = {
	notes: Note[];
	setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
	currentNote: Note | undefined;
	titleCopy: string | undefined;
	setTitleCopy: React.Dispatch<React.SetStateAction<string | undefined>>;
	createNewNote: () => Promise<void>;
	updateCurrentNote: (
		noteChanges: Partial<Omit<Note, "id">>,
	) => Promise<void | undefined>;
	handleDeleteCurrentNote: () => Promise<void | undefined>;
	handleDeleteNote: (id: string) => Promise<void>;
	isLoading: boolean;
	setNoteIdOnUrl: <Shallow>(
		value: string | ((old: string) => string | null) | null,
		options?: Options<Shallow> | undefined,
	) => Promise<URLSearchParams>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesContextProviderProps {
	children: React.ReactNode;
}

export const NotesContextProvider = ({ children }: NotesContextProviderProps) => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [noteId, setNoteIdOnUrl] = useQueryState(
		"noteId",
		parseAsString.withDefault(""),
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAllNotes = async () => {
			const _notes = await getAllNotes();

			setNotes(_notes);
			setIsLoading(false);
		};

		fetchAllNotes();
	}, []);

	const currentNote = useMemo(() => notes.find((doc) => doc.id === noteId), [noteId]);
	/**
	 * When user updates the title on UI, we modify the titleCopy instead of currentNote.title
	 * Only when the change is commited do we modify currentNote.title
	 */
	const [titleCopy, setTitleCopy] = useState(currentNote?.title);

	useEffect(() => {
		setTitleCopy(currentNote?.title);
	}, [currentNote?.title]);

	const createNewNote = async () => {
		const newNote = await createNote();

		setNotes((prevNotes) => [...prevNotes, newNote]);
		setNoteIdOnUrl(newNote.id);
	};

	const updateCurrentNote: NotesContextType["updateCurrentNote"] = useCallback(
		async (noteChanges: Partial<Omit<Note, "id">>) => {
			if (currentNote && currentNote.id) {
				await updateNote(currentNote.id, noteChanges);

				setNotes((prevNotes) =>
					prevNotes.map((note) =>
						note.id === noteId ? { ...note, ...noteChanges } : note,
					),
				);
			}
		},
		[currentNote],
	);

	const handleDeleteCurrentNote: NotesContextType["handleDeleteCurrentNote"] =
		async () => {
			if (currentNote && currentNote.id) {
				await handleDeleteNote(currentNote.id);
			}
		};

	const handleDeleteNote: NotesContextType["handleDeleteNote"] = async (id: string) => {
		await deleteNote(id);

		setNotes((prevNotes) => {
			if (!prevNotes) return prevNotes;
			const _notes = [...prevNotes];
			return _notes.filter((note) => note.id !== id);
		});
	};

	const contextValue = {
		notes,
		setNotes,
		currentNote,
		titleCopy,
		createNewNote,
		updateCurrentNote,
		handleDeleteCurrentNote,
		handleDeleteNote,
		isLoading,
		setNoteIdOnUrl,
		setTitleCopy,
	};

	return <NotesContext.Provider value={contextValue}>{children}</NotesContext.Provider>;
};

// Custom hook for easier use of the context
export const useNotesContext = () => {
	const context = useContext(NotesContext);
	if (context === undefined) {
		throw new Error("useNotesContext must be used within a NotesContextProvider");
	}
	return context;
};
