import { useEffect, useState } from 'react';

export const useDragScroll = () => {
  const [dragMoved, setDragMoved] = useState(false);

  useEffect(() => {
    let rafId: number;
    let isMouseDown = false;
    let startMouseY = 0;
    let startScrollY = 0;
    let currentScrollY = 0;
    let hasMoved = false;

    const handleMouseDown = (e: MouseEvent) => {
      // 버튼이나 링크 제외
      if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return;

      isMouseDown = true;
      startMouseY = e.clientY;
      startScrollY = window.scrollY;
      currentScrollY = window.scrollY;
      hasMoved = false;

      setDragMoved(false);

      document.body.classList.add('dragging');
      document.documentElement.classList.add('dragging');
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaY = startMouseY - e.clientY;
      const newScrollY = startScrollY + deltaY * 1.2; // Smooth scrolling multiplier

      // Check if significant movement occurred
      if (Math.abs(deltaY) > 3) {
        hasMoved = true;
        setDragMoved(true);
      }

      currentScrollY = Math.max(0, newScrollY);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      document.body.classList.remove('dragging');
      document.documentElement.classList.remove('dragging');

      if (rafId) cancelAnimationFrame(rafId);

      // Small delay to ensure dragMoved state is properly set
      setTimeout(() => {
        setDragMoved(false);
      }, 50);
    };

    const handleMouseLeave = () => {
      if (isMouseDown) {
        handleMouseUp();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { dragMoved };
};