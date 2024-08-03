import { BlockNoteEditor } from "@blocknote/core";

/**
 * Structure of a block: type, props, content, children, id
 * Structure of content:
 *    if type == 'text' type, text, styles
 *    if type == 'link' type, href, content
 *    if type == 'tableContent', see TableContent
 */

// export const extractTextFromBlocks = (blocks: Block[]): Block[] => {
// 	const texts: string[] = [];

// 	const traverseBlocks = (block: Block) => {
// 		if (block.content && Array.isArray(block.content)) {
// 			texts.push(
// 				...block.content
// 					.map((item) => {
// 						if ((item as any).type === "text") {
// 							return (item as any).text;
// 						} else if ((item as any).type === "link") {
// 							return (item as any).content
// 								.map((subItem: any) => subItem.text)
// 								.join(" ");
// 						}
// 						return "";
// 					})
// 					.join(" "),
// 			);
// 		}
// 		if (block.content && (block.content as any).type === "tableContent") {
// 			(block.content as any).rows.forEach((row: any) => {
// 				row.cells.forEach((cell: any) => {
// 					texts.push(cell.map((item: any) => item.text).join(" "));
// 				});
// 			});
// 		}
// 		if (block.children) {
// 			block.children.forEach(traverseBlocks);
// 		}
// 	};

// 	blocks.forEach(traverseBlocks);
// 	return texts;
// };

export const getCurrentBlock = (editor: BlockNoteEditor) => {
	const textCursorPosition = editor.getTextCursorPosition();
	const block = textCursorPosition.block;
	return block;
};

// export const extractContentFromBlock = (textBlock: Block): string => {
// 	// TODO: Block.content is an aggregate of crapload. Find a way to extract the content from it.
// 	const content = textBlock.content;
// 	return "";
// };

export const getSelectedText = (editor: BlockNoteEditor): string => {
	return editor.getSelectedText();
};
