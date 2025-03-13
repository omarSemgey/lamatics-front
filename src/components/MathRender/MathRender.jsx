import Katex from '@matejmazur/react-katex';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';

export default function MathRender({ content }) {
    const renderContent = (text) => {
    try {
      // Improved regex to handle inline math with special characters
        const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

        return parts.map((part, index) => {
        if (!part) return null;
        
        if (part.startsWith('$$') || part.startsWith('$')) {
            const isDisplay = part.startsWith('$$');
            const mathContent = part
            .replace(/^\$\$?/, '')
            .replace(/\$\$?$/, '');

            return (
            <Katex 
                key={index} 
                math={mathContent} 
                settings={{ displayMode: isDisplay }}
            />
            );
        }
        
        return <span key={index}>{part}</span>;
        });
    } catch {
        return <span>{text}</span>;
    }
    };

    return <div className="math-content">{renderContent(DOMPurify.sanitize(content))}</div>;
}