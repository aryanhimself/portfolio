import React, { useState, useEffect, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Mermaid from 'mermaid';
import {
    Copy,
    Check,
    ChevronRight,
    ExternalLink,
    AlertTriangle,
} from 'lucide-react';

// Types
interface CodeBlockProps {
    language: string;
    value: string;
    children: string;
}

interface MermaidProps {
    content: string;
}

interface CustomListProps {
    ordered?: boolean;
    children: ReactNode;
}

// interface AlertProps {
//     children: ReactNode;
//     type: 'info' | 'warning' | 'error' | 'success';
// }

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

// Helper Components
const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="relative group my-6">
            {/* Language Badge */}
            {language && (
                <div className="absolute left-4 top-2 text-xs text-[#64FFDA] bg-[#1f3154]/50 px-2 py-1 rounded">
                    {language}
                </div>
            )}

            {/* Copy Button */}
            <button
                type="button"
                onClick={handleCopy}
                className="absolute right-4 top-2 p-2 rounded opacity-0 group-hover:opacity-100
                 bg-[#1f3154]/50 text-[#64FFDA] hover:bg-[#1f3154] transition-all duration-200"
                title="Copy code"
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            {/* Code Block */}
            <div className="rounded-lg overflow-hidden mt-2">
                <SyntaxHighlighter
                    language={language || 'text'}
                    style={atomDark}
                    customStyle={{
                        background: 'rgb(31, 49, 84, 0.3)',
                        padding: '2rem 1.5rem 1.5rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                    }}
                    wrapLines
                    showLineNumbers
                >
                    {children}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

const MermaidDiagram: React.FC<MermaidProps> = ({ content }) => {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderDiagram = async (): Promise<void> => {
            try {
                Mermaid.initialize({
                    theme: 'dark',
                    themeVariables: {
                        primaryColor: '#64FFDA',
                        primaryTextColor: '#CCD6F6',
                        primaryBorderColor: '#1f3154',
                        secondaryColor: '#1f3154',
                        lineColor: '#8892B0',
                        textColor: '#8892B0',
                        mainBkg: '#0a101f',
                        nodeBorder: '#1f3154',
                        clusterBkg: '#1f3154',
                        titleColor: '#CCD6F6',
                    }
                });

                const { svg } = await Mermaid.render('mermaid-diagram', content);
                setSvg(svg);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to render diagram');
            }
        };

        renderDiagram();
    }, [content]);

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle size={16} />
                    <span>Failed to render diagram: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="my-8 p-4 bg-[#1f3154]/30 rounded-lg overflow-x-auto
                transform hover:scale-[1.01] transition-transform duration-200"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

const CustomList: React.FC<CustomListProps> = ({ ordered, children }) => {
    const Component = ordered ? 'ol' : 'ul';
    return (
        <Component className="my-6 space-y-2">
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                const hasNestedList = React.Children.toArray(child.props.children)
                    .some(c => React.isValidElement(c) && (c.type === 'ul' || c.type === 'ol'));

                const itemContent = (
                    <div className="flex items-start gap-2 group">
                        <span className=" flex-shrink-0">
                            {ordered ? (
                                <span className="text-[#64FFDA] text-sm font-mono">
                                    {index + 1}.
                                </span>
                            ) : (
                                <ChevronRight
                                    size={14}
                                    className="text-[#64FFDA] transform group-hover:translate-x-1 transition-transform"
                                />
                            )}
                        </span>
                        <span className="text-[#8892B0]">
                            {child.props.children}
                        </span>
                    </div>
                );

                return React.cloneElement(child, {
                    // @ts-ignore
                    className: `${hasNestedList ? 'mb-2' : ''} ${child.props.className || ''}`,
                    children: itemContent
                });
            })}
        </Component>
    );
};

// const Alert: React.FC<AlertProps> = ({ children, type }) => {
//     const styles = {
//         info: {
//             bg: 'bg-blue-500/10',
//             border: 'border-blue-500/30',
//             text: 'text-blue-400',
//             icon: <Info size={16} />
//         },
//         warning: {
//             bg: 'bg-yellow-500/10',
//             border: 'border-yellow-500/30',
//             text: 'text-yellow-400',
//             icon: <AlertTriangle size={16} />
//         },
//         error: {
//             bg: 'bg-red-500/10',
//             border: 'border-red-500/30',
//             text: 'text-red-400',
//             icon: <AlertCircle size={16} />
//         },
//         success: {
//             bg: 'bg-green-500/10',
//             border: 'border-green-500/30',
//             text: 'text-green-400',
//             icon: <CheckCircle2 size={16} />
//         }
//     };

//     const style = styles[type];

//     return (
//         <div className={`p-4 ${style.bg} border ${style.border} rounded-lg my-4`}>
//             <div className={`flex items-start gap-2 ${style.text}`}>
//                 {style.icon}
//                 <div>{children}</div>
//             </div>
//         </div>
//     );
// };

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    return (
        <ReactMarkdown
            className={`prose prose-invert max-w-none ${className}`}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                // Headings
                h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-[#CCD6F6] mb-8 mt-12 first:mt-0">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-[#CCD6F6] mb-6 mt-10">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-[#CCD6F6] mb-4 mt-8">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-lg font-bold text-[#CCD6F6] mb-4 mt-6">
                        {children}
                    </h4>
                ),
                h5: ({ children }) => (
                    <h5 className="text-base font-bold text-[#CCD6F6] mb-4 mt-6">
                        {children}
                    </h5>
                ),
                h6: ({ children }) => (
                    <h6 className="text-sm font-bold text-[#CCD6F6] mb-4 mt-6">
                        {children}
                    </h6>
                ),

                // Text elements
                p: ({ children }) => (
                    <p className="text-[#8892B0] leading-relaxed mb-6">
                        {children}
                    </p>
                ),
                strong: ({ children }) => (
                    <strong className="font-bold text-[#CCD6F6]">
                        {children}
                    </strong>
                ),
                em: ({ children }) => (
                    <em className="italic text-[#8892B0]">
                        {children}
                    </em>
                ),

                // Lists
                ul: ({ children }) => <CustomList ordered={false}>{children}</CustomList>,
                ol: ({ children }) => <CustomList ordered={true}>{children}</CustomList>,

                // Code
                // @ts-ignore
                code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';

                    if (language === 'mermaid') {
                        return <MermaidDiagram content={String(children)} />;
                    }

                    return !inline ? (
                        <CodeBlock language={language} value={String(children)} {...props}>
                            {String(children)}
                        </CodeBlock>
                    ) : (
                        <code className="px-1.5 py-0.5 bg-[#1f3154]/30 text-[#64FFDA] rounded font-mono text-sm">
                            {children}
                        </code>
                    );
                },

                // Links
                a: ({ node, children, href, ...props }) => (
                    <a
                        href={href}
                        className="text-[#64FFDA] hover:text-[#8892B0] transition-colors duration-200
                     inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                    >
                        {children}
                        <ExternalLink size={14} className="inline-block" />
                    </a>
                ),

                // Block elements
                blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[#64FFDA] pl-6 my-6">
                        <div className="text-[#8892B0] italic">
                            {children}
                        </div>
                    </blockquote>
                ),

                // Tables
                table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                        <table className="w-full border-collapse">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-[#1f3154]/30">
                        {children}
                    </thead>
                ),
                th: ({ children }) => (
                    <th className="border border-[#1f3154] p-2 text-[#CCD6F6] font-semibold text-left">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border border-[#1f3154] p-2 text-[#8892B0]">
                        {children}
                    </td>
                ),

                // Images
                img: ({ src, alt, ...props }) => (
                    <div className="relative group my-6">
                        <img
                            src={src}
                            alt={alt}
                            className="rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                            {...props}
                        />
                        {alt && (
                            <span className="block text-center text-sm text-[#8892B0] mt-2">
                                {alt}
                            </span>
                        )}
                    </div>
                ),

                // Horizontal Rule
                hr: () => (
                    <hr className="border-t border-[#1f3154] my-8" />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;