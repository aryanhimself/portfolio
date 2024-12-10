import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Calendar, Clock, ArrowLeft, User, BookOpen } from 'lucide-react';
import MarkdownRenderer from '../components/markdown-renderer';

type TableOfContent = {
    title: string;
    id: string;
    subSections?: string[];
};

type Author = {
    name: string;
    avatar: string;
};

type BlogPost = {
    id: number;
    title: string;
    excerpt: string;
    description: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    image: string;
    slug: string;
    author: Author;
    relatedPosts: string[];
    metaDescription: string;
    tableOfContents: TableOfContent[];
};

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                setLoading(true);
                const response = await fetch('/blogs.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                const foundPost = data.posts.find((p: BlogPost) => p.slug === slug);

                if (!foundPost) {
                    throw new Error('Blog post not found');
                }

                setPost(foundPost);
            } catch (err: any) {
                setError(err.message);
                console.error('Error loading blog post:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPost();
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            const headings = document.querySelectorAll('h1, h2, h3');
            let currentSection = '';

            headings.forEach((heading) => {
                const top = heading.getBoundingClientRect().top;
                if (top < 100) {
                    currentSection = heading.id;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-400">
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-teal-400 animate-pulse">Loading post...</div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-400">
                <div className="flex flex-col items-center justify-center min-h-96 gap-4">
                    <div className="text-slate-300">{error || 'Post not found'}</div>
                    <a href="/blog" className="inline-flex items-center px-6 py-3 bg-transparent border border-teal-400 text-teal-400 rounded-md hover:bg-teal-400/10 transition-all duration-300">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Blog
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-400">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <article className="lg:col-span-3">
                        {/* Navigation */}
                        <a href="/blog" className="inline-flex items-center text-teal-400 hover:text-slate-300 mb-8 transition-colors duration-200">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to Blog
                        </a>

                        {/* Hero Image */}
                        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50" />
                        </div>

                        {/* Category Badge */}
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 text-sm rounded-full bg-teal-400/10 text-teal-400">
                                {post.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold text-slate-100 mb-6">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="bg-slate-800/50 border-slate-700 p-4 mb-8">
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-teal-400" />
                                    <span>{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-teal-400" />
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-teal-400" />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap mb-8">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-sm px-3 py-1 rounded-full bg-slate-800 text-teal-400 hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Excerpt */}
                        <div className="text-lg text-slate-300 mb-8 font-medium border-l-4 border-teal-400 pl-4">
                            {post.excerpt}
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert prose-slate max-w-none">
                            <MarkdownRenderer content={post.description} />
                        </div>
                    </article>

                    {/* Table of Contents Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="bg-slate-800/50 border-slate-700 p-4">
                                <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Table of Contents
                                </h2>
                                <nav className="space-y-2">
                                    {post.tableOfContents.map((section) => (
                                        <div key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                className={`block py-1 text-sm hover:text-teal-400 transition-colors duration-200 ${activeSection === section.id ? 'text-teal-400' : 'text-slate-400'
                                                    }`}
                                            >
                                                {section.title}
                                            </a>
                                            {section.subSections && (
                                                <div className="ml-4 space-y-1">
                                                    {section.subSections.map((subSection, index) => (
                                                        <a
                                                            key={index}
                                                            href={`#${subSection.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="block py-1 text-sm text-slate-500 hover:text-teal-400 transition-colors duration-200"
                                                        >
                                                            {subSection}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;