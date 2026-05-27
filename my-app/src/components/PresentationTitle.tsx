import { Presentation } from '../types';
import { executeCommand, updatePresentationTitle } from '../editor'; 
import './PresentationHeader.css';

interface PresentationHeaderProps {
  presentationData: Presentation;
}

const PresentationHeader = ({ presentationData }: PresentationHeaderProps) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    executeCommand(updatePresentationTitle, newTitle);
  };
  
  return (
    <header className="presentation-topbar">
      <input
        type="text"
        value={presentationData.title}
        onChange={handleTitleChange}
        className="presentation-name"
        placeholder="Введите название презентации"
      />
      <div className="presentation-stats">
        Всего слайдов: {presentationData.slides.length}
      </div>
    </header>
  );
};

export default PresentationHeader;