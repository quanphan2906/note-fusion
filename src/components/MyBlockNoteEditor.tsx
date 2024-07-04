"use client";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { FC } from "react";

interface MyBlockNoteEditorProps {
	editable?: boolean;
	editor: BlockNoteEditor;
}

const MyBlockNoteEditor: FC<MyBlockNoteEditorProps> = ({ editable, editor }) => {
	if (!editor) {
		return "Loading content...";
	}

	return (
		<div className="-mx-[-48px] my-4">
			<BlockNoteView editor={editor} editable={editable} theme="light" />
		</div>
	);
};

export default MyBlockNoteEditor;
