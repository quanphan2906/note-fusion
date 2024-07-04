import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface TextComponentProps {
  quotes: { original: string, revised: string }[];
  highlight?: string; // Optional prop to highlight certain parts of the sentence
}

const TextComponent: React.FC<TextComponentProps> = ({ quotes, highlight }) => {
  const [currentQuotes, setCurrentQuotes] = useState(quotes);

  useEffect(() => {
    setCurrentQuotes(quotes);
  }, [quotes]);

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleQuoteClick = (index: number) => {
    setCurrentQuotes(currentQuotes.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      {currentQuotes.map((quote, index) => (
        <Card
          key={index}
          sx={{ borderRadius: '16px', cursor: 'pointer' }}
          onClick={() => handleQuoteClick(index)}
        >
          <CardContent>
            <Typography variant="h6" component="p">
              <strong>Original:</strong> {getHighlightedText(quote.original, highlight || '')}
            </Typography>
            <Typography variant="h6" component="p">
              <strong>Revised:</strong> {getHighlightedText(quote.revised, highlight || '')}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TextComponent;
