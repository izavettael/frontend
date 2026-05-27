import { Presentation, SlideMoveState, SlidePickState, SlideComponent } from '../types';
import { executeCommand, updateSlideOrder } from '../editor';
import './SlidesPanel.css';

interface SlidesPanelProps {
  presentationData: Presentation;
  currentSlidePosition: number; 
  onSlideClick: (slideId: string, slideNumber: number, event?: React.MouseEvent) => void;
  slideMoveState: SlideMoveState | null;
  setSlideMoveState: (state: SlideMoveState | null) => void;
  slidePickState: SlidePickState;
  setSlidePickState: (state: SlidePickState) => void;
  onClearSlideSelection: () => void;
}

const SlidesPanel = ({ 
  presentationData, 
  currentSlidePosition, 
  onSlideClick,
  slideMoveState,
  setSlideMoveState,
  slidePickState,
  setSlidePickState,
  onClearSlideSelection
}: SlidesPanelProps) => {
  
  const startSlideMove = (slideId: string, position: number, event: React.MouseEvent) => {
    event.preventDefault();
    
    const slidesForMoving = slidePickState.pickedSlideIds.includes(slideId)
      ? [...slidePickState.pickedSlideIds]
      : [slideId];

    setSlideMoveState({
      moving: true,
      movePosition: position,
      slideIdentifier: slideId
    });
  };

  const handleSlideMoveOver = (position: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (!slideMoveState?.moving) return;

    const slidesForMoving = slidePickState.pickedSlideIds.length > 1 
      ? [...slidePickState.pickedSlideIds] 
      : [slideMoveState.slideIdentifier];

    if (slidesForMoving.length === 1) {
      if (slideMoveState.movePosition === position) return;
      
      executeCommand(updateSlideOrder, {
        slideIdentifier: slideMoveState.slideIdentifier,
        newPosition: position
      });
      
      setSlideMoveState({
        ...slideMoveState,
        movePosition: position
      });
    } else {
      moveMultipleSlides(slidesForMoving, position);
    }
  };

  const moveMultipleSlides = (slideIdentifiers: string[], targetPosition: number) => {
    const movingPositions = slideIdentifiers
      .map(slideId => presentationData.slides.findIndex(slide => slide.identifier === slideId))
      .filter(position => position !== -1)
      .sort((a, b) => a - b);

    if (movingPositions.length === 0) return;

    const firstMovingPosition = movingPositions[0];
    const lastMovingPosition = movingPositions[movingPositions.length - 1];
    
    let newGroupPosition: number;

    if (targetPosition <= firstMovingPosition) {
      newGroupPosition = targetPosition;
    } else if (targetPosition > lastMovingPosition) {
      newGroupPosition = targetPosition - movingPositions.length + 1;
    } else {
      return;
    }

    const slidesCollection = [...presentationData.slides];
    
    const movingSlides = movingPositions.map(position => slidesCollection[position]);
    movingPositions.sort((a, b) => b - a).forEach(position => {
      slidesCollection.splice(position, 1);
    });

    slidesCollection.splice(newGroupPosition, 0, ...movingSlides);

    const updatedPresentation = {
      ...presentationData,
      slides: slidesCollection
    };

    executeCommand(() => updatedPresentation);
  };

  const finishSlideMove = () => {
    setSlideMoveState(null);
  };

  const handlePanelClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClearSlideSelection();
    }
  };

  const renderPreviewComponents = (components: SlideComponent[]) => {
    return components.slice(0, 3).map((component) => (
      <div
        key={component.identifier}
        className="preview-component"
        style={{
          left: `${component.coordinates.x / 10}%`,
          top: `${component.coordinates.y / 6}%`,
          width: `${component.dimensions.width / 10}%`,
          height: `${component.dimensions.height / 6}%`,
          backgroundColor: component.kind === 'text' ? '#2ecc71' : '#9b59b6'
        }}
      />
    ));
  };

  return (
    <aside 
      className="slide-navigation" 
      onClick={handlePanelClick}
    >
      <section 
        className="slide-container"
        onMouseLeave={finishSlideMove}
        onMouseUp={finishSlideMove}
      >
        {presentationData.slides.map((slide, index) => {
          const isCurrent = currentSlidePosition === index;
          const isMoving = slideMoveState?.movePosition === index;
          const isPicked = slidePickState.pickedSlideIds.includes(slide.identifier);
          const slideBackgroundColor = slide.slideBackground.backgroundType === 'color' 
            ? slide.slideBackground.colorValue 
            : '#ffffff';

          return (
            <article
              key={slide.identifier}
              className={`slide-miniature ${isCurrent ? 'current' : ''} ${isMoving ? 'moving' : ''} ${isPicked ? 'picked' : ''}`}
              onClick={(e) => onSlideClick(slide.identifier, index + 1, e)}
              onMouseDown={(e) => startSlideMove(slide.identifier, index, e)}
              onMouseOver={(e) => handleSlideMoveOver(index, e)}
              style={{
                cursor: slideMoveState?.moving ? 'grabbing' : 'grab',
                opacity: isMoving ? 0.7 : 1,
                transform: isMoving ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <header className="slide-mini-header">
                <div className="slide-position">
                  Слайд {index + 1}
                </div>
              </header>
              
              <figure className="slide-preview-area">
                <div 
                  className="slide-preview-base"
                  style={{ backgroundColor: slideBackgroundColor }}
                >
                  {renderPreviewComponents(slide.components)}
                </div>
              </figure>
            </article>
          );
        })}
      </section>
    </aside>
  );
};

export default SlidesPanel;