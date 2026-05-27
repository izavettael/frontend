import { useState, useRef } from 'react';
import { Presentation, PickState } from '../types';
import { 
  executeCommand, 
  addSlideAfterCurrent, 
  removeCurrentSlide, 
  insertTextComponent, 
  deletePickedComponent,
  updateSlideBackground,
  insertCustomImageComponent
} from '../editor';
import './Toolbar.css';

interface ToolbarProps {
  currentSlidePosition: number; 
  presentationData: Presentation;
  pickState: PickState;
}

const Toolbar = ({ 
  currentSlidePosition, 
  presentationData,
  pickState
}: ToolbarProps) => {
  const [showColorSelector, setShowColorSelector] = useState(false);
  const fileInputElement = useRef<HTMLInputElement>(null);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('#ffffff');

  const handleInsertSlide = () => {
    executeCommand(addSlideAfterCurrent, currentSlidePosition);
  };

  const handleRemoveSlide = () => {
    if (presentationData.slides.length > 1) {
      executeCommand(removeCurrentSlide, currentSlidePosition);
    }
  };

  const handleInsertText = () => {
    executeCommand(insertTextComponent, currentSlidePosition);
  };

  const handleInsertImage = () => {
    fileInputElement.current?.click();
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert('Выберите файл изображения');
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      if (imageDataUrl) {
        executeCommand(insertCustomImageComponent, {
          slidePosition: currentSlidePosition,
          imageData: imageDataUrl
        });
      }
    };
    fileReader.onerror = () => {
      alert('Ошибка при чтении файла');
    };
    fileReader.readAsDataURL(selectedFile);
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveComponent = () => {
    if (pickState.pickedComponentIds.length === 0) return;

    pickState.pickedComponentIds.forEach((componentId: string) => {
      executeCommand(deletePickedComponent, { 
        slidePosition: currentSlidePosition, 
        componentIdentifier: componentId 
      });
    });
  };

  const handleBackgroundColorChange = (color: string) => {
    setSelectedBackgroundColor(color);
    executeCommand(updateSlideBackground, { 
      slidePosition: currentSlidePosition, 
      background: { backgroundType: 'color', colorValue: color } 
    });
  };

  const toggleColorSelector = () => {
    setShowColorSelector(prev => !prev);
  };

  const canRemoveSlide = presentationData.slides.length > 1;
  const hasSelectedComponents = pickState.pickedComponentIds.length > 0;
  const selectedComponentsCount = pickState.pickedComponentIds.length;

  return (
    <nav className="tool-panel">
      <h3>Инструменты редактирования</h3>
      
      <input
        type="file"
        ref={fileInputElement}
        onChange={handleFileSelection}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <div className="tool-collection">
        <button className="tool-action" onClick={handleInsertSlide}>
          Добавить слайд
        </button>
        
        <button 
          className={`tool-action ${!canRemoveSlide ? 'tool-action--inactive' : ''}`}
          onClick={handleRemoveSlide}
          disabled={!canRemoveSlide}
        >
          Удалить слайд
        </button>
        
        <button className="tool-action" onClick={handleInsertText}>
          Добавить текст
        </button>
        
        <button className="tool-action" onClick={handleInsertImage}>
          Загрузить изображение
        </button>
        
        <button 
          className={`tool-action ${!hasSelectedComponents ? 'tool-action--inactive' : ''}`}
          onClick={handleRemoveComponent}
          disabled={!hasSelectedComponents}
        >
          {selectedComponentsCount > 1 ? 'Удалить элементы' : 'Удалить элемент'}
        </button>
        
        <div className="background-controls">
          <button 
            className="tool-action"
            onClick={toggleColorSelector}
          >
            Выбрать фон слайда
          </button>
          
          {showColorSelector && (
            <div className="color-selector">
              <h5>Выберите цвет фона:</h5>
              <div className="color-selector-main">
                <input
                  type="color"
                  value={selectedBackgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="color-input-complete"
                />
                <button 
                  className="color-apply-action"
                  onClick={() => handleBackgroundColorChange(selectedBackgroundColor)}
                >
                  Применить цвет
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Toolbar;