import React, { createContext, useContext, useState } from "react";
import { Suggestion } from "@/common/types/Suggestion";
import { searchForRelevantBlocks } from "@/services/note.service";

type SuggestionsContextType = {
	suggestions: Suggestion[];
	getSuggestionsForTextBlock: (text: string) => Promise<void>;
	setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
};

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(undefined);

interface SuggestionsContextProviderProps {
	children: React.ReactNode;
}

export const SuggestionsContextProvider = ({
	children,
}: SuggestionsContextProviderProps) => {
	const [suggestions, setSuggestions] = useState<Suggestion[]>([
		{
			noteId: "",
			noteTitle: "asdlkvm;alsd",
			content: "asdvlkm;q",
		},
	]);

	const getSuggestionsForTextBlock: SuggestionsContextType["getSuggestionsForTextBlock"] =
		async (text) => {
			const _suggestions = await searchForRelevantBlocks(text);
			setSuggestions(_suggestions);
		};

	const contextValue = {
		suggestions,
		getSuggestionsForTextBlock,
		setSuggestions,
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
