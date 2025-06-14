import React, { useEffect, useRef, useState } from 'react';
import './Blog.css';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import About from '../components/About';
import Marquee from '../components/Marquee';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vsDark from 'react-syntax-highlighter/dist/esm/styles/prism/vs-dark';
import api from '../config/api'
import NextBlogsComp from '../components/NextBlogsComp';
import Loader from '../components/Loader';


// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const CodeBlock = ({ children, language = 'javascript' }) => {
    const codeRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (codeRef.current) {
            const text = codeRef.current.innerText;
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const getLanguageLabel = (lang) => {
        const labels = {
            javascript: 'JavaScript',
            python: 'Python',
            java: 'Java',
            cpp: 'C++',
            csharp: 'C#',
            php: 'PHP',
            ruby: 'Ruby',
            swift: 'Swift',
            kotlin: 'Kotlin',
            typescript: 'TypeScript',
            html: 'HTML',
            css: 'CSS',
            sql: 'SQL',
            bash: 'Bash',
            json: 'JSON',
            xml: 'XML',
            markdown: 'Markdown',
            yaml: 'YAML',
            rust: 'Rust',
            go: 'Go'
        };
        return labels[lang] || lang;
    };

    return (
        <div className="code-block-wrapper-li3d">
            <div className="code-header-li3d">
                <span className="language-label-li3d">{getLanguageLabel(language)}</span>
                <button className="copy-button-li3d" onClick={handleCopy}>
                    {copied ? '✓ Copied!' : 'Copy'}
                </button>
            </div>
            <div ref={codeRef}>
                <SyntaxHighlighter 
                    language={language} 
                    style={vsDark} 
                    customStyle={{ 
                        margin: 0, 
                        padding: '1.5rem', 
                        borderRadius: '0 0 8px 8px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                    }}
                >
                    {children.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

const Blog = () => {
    const { Id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);
    const tocRef = useRef(null);
    const sectionsRef = useRef([]);
    const [chaiCount, setChaiCount] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    const chaiRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/blogs/${Id}`);
                setBlog(response.data.blog);
                setChaiCount(response.data.blog.chai || 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blog data:", error);
                setBlog(null);
                setLoading(false);
            }
        };
        
        fetchData();
    }, [Id]);

    const handleChaiClick = async () => {
        const newCount = chaiCount + 1;
        setChaiCount(newCount); // Update local state immediately for UI responsiveness
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 600);

        try {
            // Make API call to update chai count in the backend
            await api.put(`/api/blogs/chai/${Id}`, {
                chai: newCount,
            });
        } catch (error) {
            console.error("Error updating chai count:", error);
            // Optionally revert the state if the API call fails
            setChaiCount(chaiCount); // Revert to previous count
            alert("Failed to update chai count. Please try again.");
        }
    };

    useEffect(() => {
        if (loading || !blog || !tocRef.current || !contentRef.current) return;

        if (window.innerWidth > 768) {
            const tocHeight = tocRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;

            gsap.set(tocRef.current, {
                top: () => (viewportHeight - tocHeight) / 2,
                right: 0,
            });

            ScrollTrigger.create({
                trigger: contentRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: tocRef.current,
                pinSpacing: false,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const maxTop = viewportHeight - tocHeight;
                    if (progress < 1) {
                        gsap.to(tocRef.current, {
                            top: Math.min((viewportHeight - tocHeight) / 2, maxTop),
                            duration: 0,
                        });
                    }
                },
            });
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        document.querySelectorAll('.toc-link-li3d').forEach((link) => {
                            link.classList.remove('active-li3d');
                        });
                        const id = entry.target.getAttribute('id');
                        const tocLink = document.querySelector(`.toc-link-li3d[href="#${id}"]`);
                        if (tocLink) {
                            tocLink.classList.add('active-li3d');
                        }
                    }
                });
            },
            { rootMargin: '-50px 0px -50% 0px', threshold: 0 }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        ScrollTrigger.refresh();

        return () => {
            sectionsRef.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [blog, loading]);

    if (loading) {
        return <div> <Loader/> </div>;
    }

    if (!blog) {
        return <h2>Blog not found</h2>;
    }

    const getHeadingsFromSections = (sections) => {
        return sections.map(section => ({
            id: section.id,
            text: section.label
        }));
    };

    const headings = blog.content?.sections ? getHeadingsFromSections(blog.content.sections) : [];

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offset = window.innerHeight / 2 - element.offsetHeight / 2;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="blog-layout-li3d">
            <div className='blog-detisl-tops-e-li3d'>
                <div className='blog-thumbnail-coane-li3d'>
                    <div className='maskimage-li3d'></div>
                    <img src={blog.thumbnail} alt={blog.title} className="blog-thumbnail-xe-li3d" />
                </div>

                <div className="blog-meta-li3d">
                    <div className="keys-3dg6lec-li3d">
                        {blog.keywords.map((keyword, index) => (
                            <span key={index} className="keys-3dg6-li3d">{keyword}</span>
                        ))}
                    </div>
                    <h1>{blog.title}</h1>
                    <p className="blog-description-li3d">{blog.short_description}</p>
                    <p className='blif-dtae-li3d'>{new Date(blog.publish_date).toDateString()}</p>

                    <div className='blog-page-give-chai-li3d' onClick={handleChaiClick} ref={chaiRef}>
                        <div className="chai-container-li3d">
                            <img 
                                src="/chai.avif" 
                                alt="Give Chai" 
                                className={`chai-image-li3d ${isClicked ? 'clicked-li3d' : ''}`}
                            />
                            <span className="chai-count-li3d">{chaiCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bolg-main-decontainer-li3d'>
                <div className="blog-content-li3d" ref={contentRef}>
                    {blog.content?.sections && (
                        <div 
                            className="blog-post-content-li3d" 
                            ref={(el) => {
                                if (el) {
                                    sectionsRef.current = Array.from(el.querySelectorAll('h2'));
                                }
                            }}
                        >
                            {blog.content.sections.map(section => (
                                <div key={section.id}>
                                    <h2 id={section.id}>{section.label}</h2>
                                    <p>{section.text}</p>
                                    {section.links.map(link => (
                                        <a 
                                            key={link.id} 
                                            href={link.url} 
                                            target="_blank" 
                                            className='blog-a-tag0e'
                                            rel="noopener noreferrer"
                                        >
                                            {link.text}
                                        </a>
                                    ))}
                                    {section.codeSnippets.map(snippet => (
                                        <CodeBlock key={snippet.id} language={snippet.language}>
                                            {snippet.content}
                                        </CodeBlock>
                                    ))}
                                    {section.images.map(image => (
                                        <img 
                                            key={image.id} 
                                            src={image.url} 
                                            alt="Blog image" 
                                            style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="blog-sidebar-li3d-fd" ref={tocRef}>
                    <div className="toc-container-li3d">
                        <h3>Table of Contents</h3>
                        <nav>
                            <ul>
                                {headings.map((heading, index) => (
                                    <li key={index}>
                                        <a 
                                            href={`#${heading.id}`}
                                            className="toc-link-li3d"
                                            onClick={(e) => scrollToSection(e, heading.id)}
                                        >
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <NextBlogsComp id={Id}/>
            <Marquee/>
            <About/>
        </div>
    );
};

export default Blog;