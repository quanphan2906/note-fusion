import React from "react";
import { Typography, Card } from "@mui/material";

interface PlaceHolderProps {
	suggestions: { title: string; text: string }[];
}

const Placeholder = ({ suggestions }: PlaceHolderProps) => {
	const handleCardClick = (index: number) => {
		// setQuotes((prevQuotes) => prevQuotes.filter((_, i) => i !== index));
	};

	return (
		<div className="flex flex-col h-full bg-gray-200">
			<h1 className="p-5 w-full flex justify-center text-center text-2xl">
				Suggestion
			</h1>
			<div className="w-full border-t border-gray-300">
				{suggestions.map(({ title, text }, index) => (
					<Card
						key={index}
						className="m-2 p-2"
						onClick={() => handleCardClick(index)}
						sx={{ cursor: "pointer" }}
					>
						<Typography variant="body1">{title}</Typography>
						<Typography variant="body2">{text}</Typography>
					</Card>
				))}
			</div>
		</div>
	);
};

export default Placeholder;
