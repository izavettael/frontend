import { useState, useRef, useEffect } from 'react';
import '../styles/WorkingArea.css';
import type { Slide, TextObject, Image, SlideElement } from '../types';

interface WorkingAreaProps {
  slide: Slide;
  selectedElementId: string | null;
  selectedComponentIds: string[];
  onElementClick: (elementId: string, backgroundColor: string, e: React.MouseEvent) => void;
  onDeleteElement?: (elementId: string) => void;
  onChangeTextContent?: (elementId: string, newContent: string) => void;
  onStartDrag: (e: React.MouseEvent, componentIds: string[]) => void;
  isDragging: boolean;
  dragDelta?: { x: number; y: number };
}

// Type guards для определения типа элемента
const isTextObject = (element: SlideElement): element is TextObject => {
  return element.type === 'text';
};

const isImageObject = (element: SlideElement): element is Image => {
  return element.type === 'image';
};

function WorkingArea({ 
  slide, 
  selectedElementId,
  selectedComponentIds,
  onElementClick, 
  onDeleteElement,
  onChangeTextContent,
  onStartDrag,
  isDragging,
  dragDelta = { x: 0, y: 0 }
}: WorkingAreaProps) {
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Фокус на текстовом поле при редактировании
  useEffect(() => {
    if (editingElementId && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editingElementId]);

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;
    
    const isSelected = selectedComponentIds.includes(elementId) || selectedElementId === elementId;
    
    // Если элемент уже выделен и мы начинаем drag с него
    if (isSelected && (e.button === 0)) {
      const idsToDrag = selectedComponentIds.length > 0 ? selectedComponentIds : [elementId];
      onStartDrag(e, idsToDrag);
    } else {
      // Иначе обрабатываем как клик для выделения
      onElementClick(elementId, slide.backgroundColor || '#ffffff', e);
    }
  };

  const handleDoubleClick = (element: SlideElement) => {
    if (isTextObject(element)) {
      setEditingElementId(element.id);
      setEditContent(element.content);
    }
  };

  const handleTextContentSave = (elementId: string) => {
    if (onChangeTextContent && editContent.trim()) {
      onChangeTextContent(elementId, editContent);
    }
    setEditingElementId(null);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent, elementId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextContentSave(elementId);
    } else if (e.key === 'Escape') {
      setEditingElementId(null);
    }
  };

  const handleElementContextMenu = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    if (onDeleteElement && window.confirm('Удалить этот элемент?')) {
      onDeleteElement(elementId);
    }
  };

  const isElementSelected = (elementId: string): boolean => {
    return selectedComponentIds.includes(elementId) || selectedElementId === elementId;
  };

  const renderElement = (element: SlideElement) => {
    const isSelected = isElementSelected(element.id);
    const isEditing = editingElementId === element.id;
    
    // Применяем смещение от drag только если элемент выделен
    const currentX = element.x + (isDragging && isSelected ? dragDelta.x : 0);
    const currentY = element.y + (isDragging && isSelected ? dragDelta.y : 0);
    
    const elementStyle: React.CSSProperties = {
      left: `${currentX}px`,
      top: `${currentY}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      position: 'absolute',
      border: isSelected ? '2px solid #0066cc' : '1px solid #ddd',
      boxShadow: isSelected ? '0 0 0 2px rgba(0, 102, 204, 0.2)' : 'none',
      cursor: isSelected ? 'move' : 'pointer',
      backgroundColor: isSelected ? 'rgba(0, 102, 204, 0.1)' : 'transparent',
      zIndex: isSelected ? 10 : 1,
      userSelect: 'none',
      transition: isDragging ? 'none' : 'border-color 0.2s, box-shadow 0.2s',
    };

    return (
      <div
        key={element.id}
        className={`slide-element ${isTextObject(element) ? 'text-element' : 'image-element'} ${
          isEditing ? 'editing' : ''
        } ${isSelected ? 'selected' : ''}`}
        style={elementStyle}
        onMouseDown={(e) => handleElementMouseDown(e, element.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleDoubleClick(element);
        }}
        onContextMenu={(e) => handleElementContextMenu(e, element.id)}
        draggable={false}
      >
        {isTextObject(element) ? (
          <div className="text-element-content">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                className="text-edit-input"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={() => handleTextContentSave(element.id)}
                onKeyDown={(e) => handleTextKeyDown(e, element.id)}
                style={{
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  backgroundColor: 'transparent',
                  padding: '8px',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <div 
                className="element-content"
                style={{
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  width: '100%',
                  height: '100%',
                  padding: '8px',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                {element.content}
              </div>
            )}
          </div>
        ) : (
          <div className="image-element-content">
            {element.src ? (
              <img 
                src={element.src} 
                alt="Изображение" 
                className="element-image"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            ) : (
              <div className="image-placeholder">
                <div className="placeholder-id">{element.id.substring(0, 8)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="working-area">
      <div className="working-area-content">
        <div className="slide-container">
          <div
            className="slide-background"
            style={{
              backgroundColor: slide.backgroundColor || '#ffffff',
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '500px',
            }}
          >
            {slide.background && slide.background.map((bgImage, index) => (
              <img
                key={`bg-${bgImage.id}`}
                src={bgImage.src || ''}
                alt={`Background ${index + 1}`}
                className="background-image"
                style={{
                  left: `${bgImage.x}px`,
                  top: `${bgImage.y}px`,
                  width: `${bgImage.width}px`,
                  height: `${bgImage.height}px`,
                  position: 'absolute',
                  objectFit: 'cover',
                  zIndex: 0,
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            ))}
            
            {slide.elements && slide.elements.map(renderElement)}
            
            {isDragging && (selectedComponentIds.length > 0 || selectedElementId) && (
              <div className="drag-overlay">
                Перетаскивание {selectedComponentIds.length || 1} элемент(ов)
                {(Math.abs(dragDelta.x) > 0 || Math.abs(dragDelta.y) > 0) && (
                  <div className="drag-delta">
                    ΔX: {dragDelta.x}px, ΔY: {dragDelta.y}px
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkingArea;
