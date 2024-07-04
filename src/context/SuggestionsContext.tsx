import React, { createContext, useContext, useState } from "react";
import { Block } from "@blocknote/core";
import { Suggestion } from "@/common/types/Suggestion";
import { extractContentFromBlock } from "@/common/utils/blockNotesUtils";

const SuggestionsContext = createContext<
	| {
			suggestions: Suggestion[];
			getSuggestionsForTextBlock: (textBlock: Block) => Promise<void>;
	  }
	| undefined
>(undefined);

interface SuggestionsContextProviderProps {
	children: React.ReactNode;
}

export const SuggestionsContextProvider = ({
	children,
}: SuggestionsContextProviderProps) => {
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

	const getSuggestionsForTextBlock = async (textBlock: Block) => {
		const text = extractContentFromBlock(textBlock);
		// call to pinecone api with textBlock
		const _suggestions: Suggestion[] = [];
		setSuggestions(_suggestions);
	};

	const contextValue = {
		suggestions,
		getSuggestionsForTextBlock,
	};

	return (
		<SuggestionsContext.Provider value={contextValue}>
			{children}
		</SuggestionsContext.Provider>
	);
};

// Custom hook for easier use of the context
export const useSuggestionsContext = () => {
	const context = useContext(SuggestionsContext);
	if (context === undefined) {
		throw new Error(
			"useSuggestionsContext must be used within a SuggestionsContextProvider",
		);
	}
	return context;
};
