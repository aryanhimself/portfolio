import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Github, Linkedin, Mail, Menu, X, ExternalLink, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlogSection } from './blog-section';


const RevealSection = ({ children }: { children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className="relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default function Portfolio() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const aboutRef = useRef(null);
    const experienceRef = useRef(null);
    const projectsRef = useRef(null);
    const testimonialsRef = useRef(null);
    const contactRef = useRef(null);
    const blogRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    const navItems = [
        { label: 'ABOUT', ref: aboutRef },
        { label: 'EXPERIENCE', ref: experienceRef },
        { label: 'PROJECTS', ref: projectsRef },
        { label: 'TESTIMONIALS', ref: testimonialsRef },
        { label: 'CONTACT', ref: contactRef }
    ];

    const experiences = [
        {
            period: "2024/03 - 2024/08",
            title: "Full Stack Developer",
            company: "Sursa Technology",
            description: "Led a team of developers to design, develop, and maintain a sophisticated Next.js application. Collaborated with cross-functional teams and ensured high-quality code delivery.",
            technologies: ["Next.js", "React", "TypeScript", "Node.js"]
        },
        {
            period: "2023/09 - present",
            title: "Freelancer",
            company: "Software Engineer",
            description: "Specialized in Node.js applications, Supabase optimizations, and AI integration through OpenAI's ChatGPT APIs and LangChain.",
            technologies: ["Node.js", "Supabase", "OpenAI API", "LangChain"]
        },
        {
            period: "2021 - 2023/08",
            title: "Software Engineer",
            company: "Vurilo Nepal",
            description: "Worked as a front-end application lead and full-stack developer, utilizing AWS services and managing teaching domain applications.",
            technologies: ["AWS", "React", "Node.js", "Full Stack"]
        }
    ];

    const projects = [
        {
            title: "WriteGPT",
            description: "The multi-function web extension harnessing Chat GPT on any website while facilitating effective prompt engineering for content creation & consumption.",
            technologies: ["React", "OpenAI", "Chrome Extension"],
            link: "#"
        },
        {
            title: "MSecurity",
            description: "Worked on developing a licensing system for mobile antivirus AMD.",
            technologies: ["Mobile", "Security", "Licensing"],
            link: "#"
        },
        {
            title: "Vurilo E-learning",
            description: "E-learning Platform with comprehensive LMS features.",
            technologies: ["React", "Node.js", "AWS"],
            link: "#"
        }
    ];

    const testimonials = [
        {
            content: "Working with Aryan was an absolute pleasure. His attention to detail and commitment to code quality made our project a huge success.",
            name: "Dilip Thapa",
            role: "CEO at Sursa Technology",
            image: "/api/placeholder/48/48"
        },
        {
            content: "His understanding of both frontend and backend makes him a unique talent. He bridges the gap between design and functionality perfectly.",
            name: "Lead Developer",
            role: "Vurilo Nepal",
            image: "/api/placeholder/48/48"
        }
    ];

    return (
        <div className="relative min-h-screen bg-[#0a101f] text-[#8B949E] font-mono overflow-x-hidden">
            {/* <CustomCursor /> */}
            {/* Background Bubble Effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute transition-transform duration-300 ease-out"
                    style={{
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle at center, rgba(31, 49, 84, 0.4) 0%, rgba(31, 49, 84, 0.2) 40%, transparent 70%)',
                        borderRadius: '50%',
                        transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
                        filter: 'blur(40px)'
                    }}
                />
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`fixed inset-0 bg-[#0a101f] z-30 md:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="p-8">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-4 right-4 text-[#64FFDA]"
                    >
                        <X size={24} />
                    </button>
                    <div className="space-y-8 mt-12">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                onClick={() => scrollToSection(item.ref)}
                                className="text-[#8892B0] text-xl font-semibold cursor-pointer hover:text-[#64FFDA] transition-colors duration-200"
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar - Hidden on mobile */}
            <div className="fixed left-0 top-0 h-screen w-64 p-8 border-r border-[#1f3154] bg-[#0a101f]/80 backdrop-blur-sm z-20 hidden md:block">
                <div className="mb-12">
                    <h1 className="text-2xl font-bold text-[#CCD6F6] mb-1">Aryan Phuyal</h1>
                    <h2 className="text-lg text-[#8892B0] mb-8">Full Stack Developer</h2>

                    <nav className="space-y-4 text-sm">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                onClick={() => scrollToSection(item.ref)}
                                className="text-[#8892B0] uppercase tracking-wider text-xs font-semibold mb-4 cursor-pointer hover:text-[#64FFDA] transition-colors duration-200"
                            >
                                {item.label}
                            </div>
                        ))}
                    </nav>

                    <div className="flex gap-3 mt-8">
                        <a href="https://github.com/aryanhimself" target="_blank" rel="noopener noreferrer"
                            className="text-[#8892B0] hover:text-[#64FFDA] transition-colors duration-200">
                            <Github size={20} />
                        </a>
                        <a href="https://linkedin.com/in/phuyalrn2" target="_blank" rel="noopener noreferrer"
                            className="text-[#8892B0] hover:text-[#64FFDA] transition-colors duration-200">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:phuyalrn2@gmail.com"
                            className="text-[#8892B0] hover:text-[#64FFDA] transition-colors duration-200">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="md:ml-64 p-4 md:p-12 relative z-10">
                {/* About Section */}
                <section ref={aboutRef} className="min-h-screen flex items-center transform hover:scale-[1.01] transition-transform duration-300">
                    <RevealSection>
                        <div className="max-w-2xl">
                            <h2 className="text-[#64FFDA] text-lg mb-4">Hi, my name is</h2>
                            <h1 className="text-4xl md:text-6xl font-bold text-[#CCD6F6] mb-4">Aryan Phuyal.</h1>
                            <h2 className="text-2xl md:text-4xl font-bold text-[#8892B0] mb-6">I build things for the web.</h2>
                            <p className="text-[#8892B0] leading-relaxed mb-4 text-lg">
                                I am a hardworking, motivated developer with extensive knowledge in the field through study and research.
                                Currently, I am learning DevOps and k8s while pursuing my MscIT in Data Analytics.
                            </p>
                        </div>
                    </RevealSection>
                </section>

                {/* Experience Section */}
                <section ref={experienceRef} className="mb-16 pt-16">
                    <RevealSection>
                        <h2 className="text-[#CCD6F6] text-2xl font-semibold mb-12">Experience</h2>
                        <div className="space-y-12">
                            {experiences.map((exp, index) => (
                                <div
                                    key={index}
                                    className="relative border-l-2 border-[#1f3154] pl-6 transform hover:scale-[1.02] transition-transform duration-200"
                                >
                                    <div className="absolute w-3 h-3 bg-[#64FFDA] rounded-full -left-[7px] top-2" />
                                    <span className="text-[#64FFDA] text-sm">{exp.period}</span>
                                    <h3 className="text-[#CCD6F6] font-semibold text-xl mt-2">
                                        {exp.title} · {exp.company}
                                        <ExternalLink className="inline-block ml-2 w-4 h-4" />
                                    </h3>
                                    <p className="text-[#8892B0] mt-2">{exp.description}</p>
                                    <div className="flex gap-2 mt-4 flex-wrap">
                                        {exp.technologies.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-xs rounded bg-[#1f3154]/30 text-[#64FFDA]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealSection>
                </section>

                {/* Projects Section */}
                <section ref={projectsRef} className="mb-16 pt-16">
                    <RevealSection>
                        <h2 className="text-[#CCD6F6] text-2xl font-semibold mb-12">Featured Projects</h2>
                        <div className="grid gap-8">
                            {projects.map((project, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-[#0a101f] border border-[#1f3154] rounded-lg p-6 
                         transition-all duration-300 hover:bg-[#1f3154]/30 
                         transform hover:scale-[1.02]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[#CCD6F6] font-semibold text-xl group-hover:text-[#64FFDA] flex items-center">
                                            {project.title}
                                            <ExternalLink className="inline-block ml-2 w-4 h-4" />
                                        </h3>
                                    </div>
                                    <p className="text-[#8892B0] mb-4">{project.description}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {project.technologies.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-xs rounded bg-[#1f3154]/30 text-[#64FFDA]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealSection>
                </section>

                {/* Testimonials Section */}
                <section ref={testimonialsRef} className="mb-16 pt-16">
                    <RevealSection>
                        <h2 className="text-[#CCD6F6] text-2xl font-semibold mb-12">Testimonials</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0a101f] border border-[#1f3154] p-6 rounded-lg 
                         transition-all duration-300 hover:bg-[#1f3154]/30
                         transform hover:scale-[1.02]"
                                >
                                    <Quote size={24} className="text-[#64FFDA] mb-4" />
                                    <p className="text-[#8892B0] mb-6">{testimonial.content}</p>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <h4 className="text-[#CCD6F6] font-medium">{testimonial.name}</h4>
                                            <p className="text-[#64FFDA] text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealSection>
                </section>

                {/* Contact Section */}
                <section ref={contactRef} className="mb-16 pt-16">
                    <RevealSection>
                        <h2 className="text-[#CCD6F6] text-2xl font-semibold mb-12">Get In Touch</h2>
                        <div className="max-w-2xl transform hover:scale-[1.01] transition-transform duration-200">
                            <a
                                href="mailto:phuyalrn2@gmail.com"
                                className="inline-flex items-center px-6 py-3 bg-transparent border border-[#64FFDA] 
                     text-[#64FFDA] rounded-md hover:bg-[#64FFDA]/10 transition-all duration-300"
                            >
                                <Mail className="mr-2" size={16} />
                                Say Hello
                            </a>
                        </div>
                    </RevealSection>
                </section>

                {/* Blog Section */}
                <section ref={blogRef} className="mb-16 pt-16">
                    <RevealSection>
                        <BlogSection />
                    </RevealSection>
                </section>

                {/* Footer */}
                <footer className="text-center text-[#8892B0] py-8 mt-16 border-t border-[#1f3154]">
                    <p className="text-sm">
                        Built with React & Tailwind CSS by Aryan Phuyal
                    </p>
                </footer>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="fixed md:hidden bottom-6 right-6 z-50 p-3 bg-[#1f3154] rounded-full text-[#64FFDA] hover:bg-[#64FFDA]/10 transition-colors duration-200"
                aria-label="Toggle mobile menu"
            >
                <Menu size={24} />
            </button>
        </div>
    );
}