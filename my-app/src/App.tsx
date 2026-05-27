import { useState, useEffect } from 'react';
import { Presentation, MoveState, ResizeAction, PickState, SlideMoveState, SlidePickState } from './types';
import { getEditorState, addEditorUpdateListener } from './editor';
import './styles/App.css';
import PresentationHeader from './components/PresentationTitle';
import Workspace from './components/WorkingArea';
import SlidesPanel from './components/SlideList';
import Toolbar from './components/Toolbar';

function App() {
  const [presentationData, setPresentationData] = useState<Presentation>(getEditorState());
  const [currentSlidePosition, setCurrentSlidePosition] = useState(0);
  const [pickedComponentId, setPickedComponentId] = useState<string | null>(null);
  
  const [moveState, setMoveState] = useState<MoveState | null>(null);
  const [resizeAction, setResizeAction] = useState<ResizeAction | null>(null);
  const [pickState, setPickState] = useState<PickState>({
    pickedComponentIds: [],
    multiplePicks: false
  });
  const [slideMoveState, setSlideMoveState] = useState<SlideMoveState | null>(null);
  const [slidePickState, setSlidePickState] = useState<SlidePickState>({
    pickedSlideIds: [],
    multiplePicks: false
  });

  useEffect(() => {
    const handleEditorUpdate = () => {
      const newPresentation = getEditorState();
      setPresentationData(newPresentation);
      
      if (currentSlidePosition >= newPresentation.slides.length) {
        setCurrentSlidePosition(Math.max(0, newPresentation.slides.length - 1));
      }
    };

    addEditorUpdateListener(handleEditorUpdate);

    return () => {
      addEditorUpdateListener(null);
    };
  }, [currentSlidePosition]);

  const handleComponentClick = (componentIdentifier: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setPickState(prev => ({
        pickedComponentIds: prev.pickedComponentIds.includes(componentIdentifier)
          ? prev.pickedComponentIds.filter(id => id !== componentIdentifier)
          : [...prev.pickedComponentIds, componentIdentifier],
        multiplePicks: true
      }));
      setPickedComponentId(componentIdentifier);
    } else {
      setPickState({
        pickedComponentIds: [componentIdentifier],
        multiplePicks: false
      });
      setPickedComponentId(componentIdentifier);
    }
  };

  const handleSlideClick = (slideIdentifier: string, slideNumber: number, event?: React.MouseEvent) => {
    const newPosition = slideNumber - 1;
    
    if (event?.ctrlKey || event?.metaKey) {
      setSlidePickState(prev => ({
        pickedSlideIds: prev.pickedSlideIds.includes(slideIdentifier)
          ? prev.pickedSlideIds.filter(id => id !== slideIdentifier)
          : [...prev.pickedSlideIds, slideIdentifier],
        multiplePicks: true
      }));
    } else {
      setSlidePickState({
        pickedSlideIds: [slideIdentifier],
        multiplePicks: false
      });
      
      setPickedComponentId(null);
      setPickState({
        pickedComponentIds: [],
        multiplePicks: false
      });
    }

    if (newPosition >= 0 && newPosition < presentationData.slides.length) {
      setCurrentSlidePosition(newPosition);
    }
  };

  const handleClearPicks = () => {
    setPickedComponentId(null);
    setPickState({
      pickedComponentIds: [],
      multiplePicks: false
    });
  };

  const handleClearSlidePicks = () => {
    setSlidePickState({
      pickedSlideIds: [],
      multiplePicks: false
    });
  };

  return (
    <div className="app">
      <PresentationHeader 
        presentationData={presentationData}
      />
      
      <div className="app-main">
        <Toolbar 
          currentSlidePosition={currentSlidePosition}
          presentationData={presentationData}
          pickState={pickState}
        />
        <Workspace 
          presentationData={presentationData}
          currentSlidePosition={currentSlidePosition}
          onComponentClick={handleComponentClick}
          pickedComponentId={pickedComponentId}
          moveState={moveState}
          setMoveState={setMoveState}
          resizeAction={resizeAction}
          setResizeAction={setResizeAction}
          pickState={pickState}
          onClearPicks={handleClearPicks}
        />
        <SlidesPanel 
          presentationData={presentationData}
          currentSlidePosition={currentSlidePosition}
          onSlideClick={handleSlideClick}
          slideMoveState={slideMoveState}
          setSlideMoveState={setSlideMoveState}
          slidePickState={slidePickState}
          setSlidePickState={setSlidePickState}
          onClearSlideSelection={handleClearSlidePicks}
        />
      </div>
    </div>
  );
}

export default App;
