import { Block } from "@blocknote/core";

export type Note = {
	id: string;
	title: string;
	content: Block[];
};
