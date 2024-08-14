import { Note } from "@/common/types/Note";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ServiceResult } from "@/common/types/ServiceResult";
import { Options, parseAsString, useQueryState } from "nuqs";
import { createNote, deleteNote, getAllNotes, updateNote } from "@/services/note";

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
	) => Promise<ServiceResult<void> | undefined>;
	handleDeleteCurrentNote: () => Promise<ServiceResult<void> | undefined>;
	handleDeleteNote: (id: string) => Promise<ServiceResult<void>>;
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
			const { data: _notes, status, message } = await getAllNotes();

			if (status === "OK" && _notes !== undefined) setNotes(_notes);
			if (status === "ERROR") console.error(message);
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
		const queryResult = await createNote();

		if (queryResult.status === "ERROR" || queryResult.data === undefined) {
			// handle error globally
			console.error("Error creating new note");
		}

		if (queryResult.status === "OK" && queryResult.data !== undefined) {
			setNotes((prevNotes) => [...prevNotes, queryResult.data as Note]);
			setNoteIdOnUrl(queryResult.data.id);
		}
	};

	const updateCurrentNote = useCallback(
		async (noteChanges: Partial<Omit<Note, "id">>) => {
			if (currentNote && currentNote.id) {
				const queryResult = await updateNote(currentNote.id, noteChanges);

				if (queryResult.status === "ERROR") {
					console.error(queryResult.message);
				}

				setNotes((prevNotes) =>
					prevNotes.map((note) =>
						note.id === noteId ? { ...note, ...noteChanges } : note,
					),
				);

				return queryResult;
			}
		},
		[currentNote],
	);

	const handleDeleteCurrentNote: NotesContextType["handleDeleteCurrentNote"] =
		async () => {
			if (currentNote && currentNote.id) {
				const queryResult = await handleDeleteNote(currentNote.id);
				// set a different note id
				return queryResult;
			}
		};

	const handleDeleteNote = async (id: string) => {
		const queryResult = await deleteNote(id);

		setNotes((prevNotes) => {
			if (!prevNotes) return prevNotes;
			const _notes = [...prevNotes];
			return _notes.filter((note) => note.id !== id);
		});

		return queryResult;
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
