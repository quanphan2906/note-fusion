"use client";

import TextareaAutoSize from "react-textarea-autosize";
import { useEffect, useCallback } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useDebounce } from "@uidotdev/usehooks";
import { Box, IconButton, Stack } from "@mui/material";
import { useCreateBlockNote } from "@blocknote/react";
import { getSelectedText } from "@/common/utils/blockNotesUtils";
import { useNotesContext } from "@/context/NotesContext";
import { useSuggestionsContext } from "@/context/SuggestionsContext";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { SearchOutlined } from "@mui/icons-material";

const DEFAULT_BLOCKS: PartialBlock = {
	type: "paragraph",
	props: {
		backgroundColor: "default",
		textColor: "default",
		textAlignment: "left",
	},
	content: [{ type: "text", text: "", styles: {} }],
	children: [],
};

const UPDATE_INTERVAL = 20000; // ms

export default function NoteDoc() {
	const { currentNote, updateCurrentNote, titleCopy, setTitleCopy } = useNotesContext();

	const editor: BlockNoteEditor = useCreateBlockNote({
		initialContent: currentNote?.content ?? [DEFAULT_BLOCKS],
	});

	useEffect(() => {
		// reset the blocknotes editor
		const blockIds = editor.document.map((block) => block.id);
		editor.insertBlocks(
			currentNote?.content ?? [DEFAULT_BLOCKS],
			blockIds[blockIds.length - 1],
		);
		editor.removeBlocks(blockIds);
	}, [currentNote]);

	const updateNote = useCallback(async () => {
		await updateCurrentNote({
			title: titleCopy,
			content: editor.document,
		});
	}, [updateCurrentNote, titleCopy, editor.document]);

	/**
	 * Within UPDATE_INTERVAL, if there's no change to updateNote,
	 * updateNote will be re-rerun. Notice that updateNote is only updated
	 * when editor.document changes.
	 */
	useDebounce(updateNote, UPDATE_INTERVAL);

	const { getSuggestionsForTextBlock } = useSuggestionsContext();

	const handleGetSuggestions = async () => {
		const currentContent = getSelectedText(editor);
		await getSuggestionsForTextBlock(currentContent);
	};

	return (
		<Box>
			<Stack direction="row">
				<div className="flex flex-col px-24 py-10">
					<TextareaAutoSize
						placeholder="Untitled"
						className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
						value={titleCopy}
						onChange={(e) => setTitleCopy(e.target.value)}
					/>
				</div>
				<IconButton
					onClick={handleGetSuggestions}
					style={{
						marginRight: 160,
						backgroundColor: "transparent",
						border: "none",
						outline: "none",
						boxShadow: "none",
					}}
				>
					<SearchOutlined />
				</IconButton>
			</Stack>
			<Stack className="-mx-[-48px] my-4">
				<BlockNoteView editor={editor} editable={true} theme="light" />
			</Stack>
		</Box>
	);
}
