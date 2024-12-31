import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Search, Link } from 'lucide-react';

export type BlogPost = {
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
};

export const BlogSection = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const categories = ["All", ...new Set(blogPosts.map((post: BlogPost) => post.category))];

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/blogs.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                setBlogPosts(data.posts);
            } catch (err) {
                setError('Failed to load blog posts');
                console.error('Error loading blog posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="text-[#64FFDA]">Loading posts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h2 className="text-[#CCD6F6] text-xl sm:text-2xl font-semibold mb-6 sm:mb-12">Blog</h2>

            {/* Search and Filter Bar */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-6 sm:mb-8">
                {/* Search Input */}
                <div className="relative w-full sm:w-64 lg:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#1f3154]/30 border border-[#1f3154] rounded-md 
                                 text-[#CCD6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#64FFDA] 
                                 focus:border-transparent transition-all duration-300"
                    />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full sm:hidden px-4 py-2 bg-[#1f3154]/30 text-[#8892B0] rounded-md"
                >
                    {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Category Filters */}
                <div className={`${isFilterOpen ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2`}>
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-300 
                                    ${selectedCategory === category
                                    ? 'bg-[#64FFDA] text-[#0a101f]'
                                    : 'bg-[#1f3154]/30 text-[#8892B0] hover:bg-[#1f3154]/50'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                    <a href={`/blog/${post.slug}`} key={post.slug}>
                        <article
                            key={post.id}
                            className="group bg-[#0a101f] border border-[#1f3154] rounded-lg overflow-hidden
                                 hover:scale-[1.02] transition-all duration-300 hover:bg-[#1f3154]/30"
                        >
                            {/* Post Image */}
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-[#0a101f]/10" />
                            </div>

                            {/* Post Content */}
                            <div className="p-4 sm:p-6">
                                {/* Category Tag */}
                                <span className="inline-block px-2 py-1 text-xs rounded bg-[#1f3154]/30 text-[#64FFDA] mb-3">
                                    {post.category}
                                </span>

                                <h3 className="text-[#CCD6F6] font-semibold text-lg sm:text-xl mb-2 group-hover:text-[#64FFDA] line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-[#8892B0] text-xs sm:text-sm mb-3 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Meta Information */}
                                <div className="flex items-center gap-3 text-xs text-[#8892B0] mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex gap-2 flex-wrap mb-3">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs text-[#64FFDA] hover:text-[#8892B0] cursor-pointer transition-colors duration-200"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="text-xs text-[#8892B0]">+{post.tags.length - 3}</span>
                                    )}
                                </div>

                                {/* Read More Link */}
                                <a
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-sm text-[#64FFDA] hover:text-[#8892B0] transition-colors duration-200"
                                >
                                    Read More
                                    <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                                </a>
                            </div>
                        </article>
                    </a>
                ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <p className="text-[#8892B0] text-base sm:text-lg">
                        No blog posts found matching your criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BlogSection;