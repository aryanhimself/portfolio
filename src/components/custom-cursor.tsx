import { useState, useEffect } from 'react';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [trails, setTrails] = useState([]);

    useEffect(() => {
        const MAX_TRAILS = 8;
        const addTrail = (x, y) => {
            setTrails(prev => [...prev.slice(-MAX_TRAILS), { x, y, id: Date.now() }]);
        };

        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            addTrail(e.clientX, e.clientY);
            setIsHidden(false);

            // Check if cursor is over a clickable element
            const target = e.target;
            const computed = window.getComputedStyle(target);
            setIsPointer(computed.cursor === 'pointer');
        };

        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseLeave = () => setIsHidden(true);

        // Add event listeners
        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        // Track hoverable elements
        const updateHoverables = () => {
            const hoverableElements = document.querySelectorAll('a, button, [role="button"]');

            hoverableElements.forEach(elem => {
                elem.addEventListener('mouseenter', () => setIsHovering(true));
                elem.addEventListener('mouseleave', () => setIsHovering(false));
            });
        };

        // Initial setup and cleanup of hoverable elements
        updateHoverables();
        const observer = new MutationObserver(updateHoverables);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            observer.disconnect();
        };
    }, []);

    if (isHidden) return null;

    return (
        <>
            {/* Trail effects */}
            {trails.map((trail, index) => (
                <div
                    key={trail.id}
                    className="fixed pointer-events-none z-50 mix-blend-difference"
                    style={{
                        left: trail.x,
                        top: trail.y,
                        transform: 'translate(-50%, -50%)',
                        opacity: index / trails.length,
                    }}
                >
                    <div
                        className={`rounded-full bg-white transition-transform duration-150
                                  ${isHovering ? 'scale-0' : 'scale-100'}`}
                        style={{
                            width: `${4 + (index * 0.5)}px`,
                            height: `${4 + (index * 0.5)}px`,
                        }}
                    />
                </div>
            ))}

            {/* Main cursor */}
            <div
                className="fixed pointer-events-none z-50 mix-blend-difference"
                style={{
                    left: position.x,
                    top: position.y,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {/* Outer ring */}
                <div
                    className={`rounded-full border border-white transition-all duration-200
                              ${isHovering ? 'w-16 h-16 opacity-100' : 'w-8 h-8 opacity-80'}
                              ${isPointer ? 'scale-150' : 'scale-100'}`}
                />

                {/* Inner dot */}
                <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                              rounded-full bg-white transition-all duration-200
                              ${isHovering ? 'w-1 h-1 opacity-100' : 'w-2 h-2 opacity-80'}`}
                />
            </div>
        </>
    );
};