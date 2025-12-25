import React, { useEffect, useRef, useState } from 'react';

type ResizableCardProps = {
    children: React.ReactNode;
    id: string;
    defaultWidth?: number;
    defaultHeight?: number;
    minWidth?: number;
    minHeight?: number;
    onResize?: (width: number, height: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    isDragging?: boolean;
    dragHandleClassName?: string;
};

const ResizableCard: React.FC<ResizableCardProps> = ({
    children,
    id,
    defaultWidth = 280,
    defaultHeight = 200,
    minWidth = 200,
    minHeight = 150,
    onResize,
    onDragStart,
    onDragEnd,
    isDragging = false,
    dragHandleClassName = '',
}) => {
    const [dimensions, setDimensions] = useState(() => {
        const saved = localStorage.getItem(`card-${id}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                width: parsed.width || defaultWidth,
                height: parsed.height || defaultHeight,
            };
        }
        return { width: defaultWidth, height: defaultHeight };
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const [isResizing, setIsResizing] = useState(false);
    const [isDraggingCard, setIsDraggingCard] = useState(false);
    const [resizeType, setResizeType] = useState<'se' | 'e' | 's' | null>(null);
    const [contentMinHeight, setContentMinHeight] = useState(minHeight);
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const dragStartPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const saved = localStorage.getItem(`card-${id}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            setDimensions({
                width: parsed.width || defaultWidth,
                height: parsed.height || defaultHeight,
            });
        }
    }, [id, defaultWidth, defaultHeight]);

    // Measure content height to determine min-height (max-content)
    useEffect(() => {
        const measureContentHeight = () => {
            if (contentRef.current) {
                // Get the first child element (the actual card content)
                const cardContent = contentRef.current
                    .firstElementChild as HTMLElement;
                if (cardContent) {
                    // Temporarily remove height constraint to measure natural height
                    const originalHeight = cardContent.style.height;
                    const originalMinHeight = cardContent.style.minHeight;
                    cardContent.style.height = 'auto';
                    cardContent.style.minHeight = 'auto';

                    // Measure the scroll height (natural content height)
                    const contentHeight = cardContent.scrollHeight;

                    // Restore original styles
                    cardContent.style.height = originalHeight;
                    cardContent.style.minHeight = originalMinHeight;

                    // Use the measured height as minimum (max-content behavior)
                    setContentMinHeight(Math.max(minHeight, contentHeight));
                }
            }
        };

        // Use a small delay to ensure content is rendered
        const timeoutId = setTimeout(() => {
            measureContentHeight();
        }, 0);

        // Use ResizeObserver to detect content changes
        const resizeObserver = new ResizeObserver(() => {
            measureContentHeight();
        });

        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
        };
    }, [children, minHeight]);

    useEffect(() => {
        localStorage.setItem(`card-${id}`, JSON.stringify(dimensions));
        onResize?.(dimensions.width, dimensions.height);
    }, [dimensions, id, onResize]);

    const handleMouseDown = (e: React.MouseEvent, type: 'se' | 'e' | 's') => {
        // Don't allow resizing on mobile
        if (isMobile) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeType(type);

        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            startPosRef.current = {
                x: e.clientX,
                y: e.clientY,
                width: rect.width,
                height: rect.height,
            };
        }
    };

    const handleDragStart = (e: React.MouseEvent) => {
        // Don't start drag on mobile or if clicking on resize handles
        if (isMobile) {
            return;
        }

        const target = e.target as HTMLElement;
        if (target.closest('[data-resize-handle]') || isResizing) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        setIsDraggingCard(true);
        onDragStart?.();

        if (cardRef.current) {
            dragStartPosRef.current = {
                x: e.clientX,
                y: e.clientY,
            };
        }
    };

    useEffect(() => {
        if (!isResizing || !resizeType) return;

        // Set cursor style on body during resize
        const cursorStyle =
            resizeType === 'se'
                ? 'se-resize'
                : resizeType === 'e'
                  ? 'e-resize'
                  : 's-resize';

        document.body.style.cursor = cursorStyle;
        document.body.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startPosRef.current.x;
            const deltaY = e.clientY - startPosRef.current.y;

            let newWidth = startPosRef.current.width;
            let newHeight = startPosRef.current.height;

            if (resizeType === 'se' || resizeType === 'e') {
                newWidth = Math.max(
                    minWidth,
                    startPosRef.current.width + deltaX
                );
            }
            if (resizeType === 'se' || resizeType === 's') {
                newHeight = Math.max(
                    contentMinHeight,
                    startPosRef.current.height + deltaY
                );
            }

            setDimensions({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeType(null);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, resizeType, minWidth, contentMinHeight]);

    // Handle card dragging
    useEffect(() => {
        if (!isDraggingCard) return;

        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';

        // Dragging is handled by the parent component
        // This effect just manages the visual state

        const handleMouseUp = () => {
            setIsDraggingCard(false);
            onDragEnd?.();
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDraggingCard, onDragEnd]);

    return (
        <div
            ref={cardRef}
            className={`relative ${isResizing || isDraggingCard ? 'select-none' : ''} ${
                isDragging || isDraggingCard ? 'opacity-50 z-50' : ''
            } transition-opacity w-full lg:w-auto`}
            style={{
                width: isMobile ? '100%' : `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                minWidth: isMobile ? '100%' : `${minWidth}px`,
                minHeight: `${contentMinHeight}px`,
            }}
        >
            <div
                ref={contentRef}
                className={`h-full w-full ${dragHandleClassName || 'cursor-grab active:cursor-grabbing'}`}
                onMouseDown={handleDragStart}
            >
                {children}
            </div>
            {/* Resize handles - Hidden on mobile */}
            {/* Bottom-right corner handle (resize both) */}
            <div
                data-resize-handle
                className="hidden lg:block absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group z-10"
                onMouseDown={(e) => handleMouseDown(e, 'se')}
            >
                <div className="absolute bottom-0.5 right-0.5 w-4 h-4">
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary-30 group-hover:border-primary transition-colors"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-primary-20 group-hover:border-primary-50 transition-colors"></div>
                </div>
            </div>
            {/* Right edge handle (resize width) */}
            <div
                data-resize-handle
                className="hidden lg:block absolute top-0 right-0 w-2 h-full cursor-e-resize hover:bg-primary-10 transition-colors opacity-0 hover:opacity-100 z-10"
                onMouseDown={(e) => handleMouseDown(e, 'e')}
            ></div>
            {/* Bottom edge handle (resize height) */}
            <div
                data-resize-handle
                className="hidden lg:block absolute bottom-0 left-0 w-full h-2 cursor-s-resize hover:bg-primary-10 transition-colors opacity-0 hover:opacity-100 z-10"
                onMouseDown={(e) => handleMouseDown(e, 's')}
            ></div>
        </div>
    );
};

export default ResizableCard;
