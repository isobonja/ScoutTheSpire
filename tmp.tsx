import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

type CardDisplayProps = {
  name?: string;
  imageUrl?: string;
  cost?: number;
  cardClass?: string;
  cardType?: string;
  description?: string;
  keywords?: string[];
}

function CardDisplay({ name, imageUrl, cost, cardClass, cardType, description, keywords }: CardDisplayProps) {
  const [cardBackgroundColor, setCardBackgroundColor] = useState<string>("bg-gray-800");

  const TAG_STYLES: Record<string, string> = {
    gold: "text-yellow-400",
    red: "text-red-400",
    green: "text-green-400",
    blue: "text-blue-400",
  };

  const TEST_DESCRIPTION = "This is a [gold]formatted[/gold] description with [red]multiple[/red] tags and [green]colors[/green].";

  function parseFormattedText(text: string): React.ReactNode {
    const stack: { tag: string; children: React.ReactNode[] }[] = [];
    const root: React.ReactNode[] = [];

    const regex = /\[(\/?)(\w)\]/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [full, closing, tag] = match;

      // Push text before this tag
      const content = text.slice(lastIndex-1, match.index);
      if (content) {
        (stack[stack.length - 1]?.children ?? root).push(content);
      }

      if (!closing) {
        // Opening tag
        stack.push({ tag, children: [] });
      } else {
        // Closing tag
        const node = stack.pop();

        if (node) {
          const element = (
            <span
              key={match.index}
              className={TAG_STYLES[node.tag] || ""}
            >
              {node.children}
            </span>
          );

          (stack[stack.length - 1]?.children ?? root).push(element);
        }
      }

      lastIndex = match.index + full.length;
    }

    // Remaining text
    if (lastIndex < text.length) {
      (stack[stack.length - 1]?.children ?? root).push(
        text.slice(lastIndex)
      );
    }

    return root;
  }

  useEffect(() => {
    if (cardClass === "ironclad") {
      setCardBackgroundColor("bg-red-800");
    } else if (cardClass === "defect") {
      setCardBackgroundColor("bg-blue-800");
    } else if (cardClass === "silent") {
      setCardBackgroundColor("bg-green-800");
    } else if (cardClass === "regent") {
      setCardBackgroundColor("bg-orange-800");
    } else if (cardClass === "necrobinder") {
      setCardBackgroundColor("bg-purple-800");
    
    } else {
      setCardBackgroundColor("bg-gray-800");
    }
  }, [cardClass]);


  return (
    <div className="border border-gray-300 rounded-lg p-4 h-full min-h-0 ">
      {/* card */}
      <div className={`w-100 flex flex-col items-center border border-pink-500 gap-2 relative aspect-[9/16] ${cardBackgroundColor}`}>
        {/* card name */}
        <span className="text-white font-bold" style={{ fontSize: "2.25rem" }}>{name || "Placeholder Name"}</span>

        {/* card image */}
        <div className='w-full flex flex-col items-center'>
          <img src={imageUrl || "https://via.placeholder.com/150"} alt="Card Image" className="aspect-2/1 object-cover rounded-md" />
          {/*<span className='text-white'>{imageUrl}</span>*/}
        </div>

        {/* card cost badge */}
        <Badge className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
          {cost || -1}
        </Badge>

        {/* card class/type container */}
        <div className='flex gap-2'>
          <Badge className="text-white bg-gray-800 p-1 w-16 h-6 flex items-center justify-center text-xs">
            {cardClass || "CLASS"}
          </Badge>
          <Badge className="text-white bg-gray-800 p-1 w-16 h-6 flex items-center justify-center text-xs">
            {cardType || "TYPE"}
          </Badge>
        </div>

        {/* card description */}
        <p className="text-white text-sm text-center">
          {description && parseFormattedText(TEST_DESCRIPTION || "") || "This is a placeholder description for the card. It provides details about the card's abilities and effects."}
        </p>

        {/* card keywords */}
        <div className='flex gap-2 mt-2'>
          {keywords && keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <Badge key={index} className="text-white bg-gray-800 p-1 w-16 h-6 flex items-center justify-center text-xs">
                {keyword}
              </Badge>
            ))) : (
            <>
              <Badge className="text-white bg-gray-800 p-1 w-16 h-6 flex items-center justify-center text-xs">
                KEYWORD 1
              </Badge>
              <Badge className="text-white bg-gray-800 p-1 w-16 h-6 flex items-center justify-center text-xs">
                KEYWORD 2
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardDisplay;