import { ImageComponent as ImageComponentType } from '../types';

interface ImageComponentProps {
  component: ImageComponentType;
}

const ImageComponent = ({ component }: ImageComponentProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          width: 100%; 
          height: 100%; 
          background: #e9ecef; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 1px dashed #6c757d; 
          color: #6c757d; 
          font-size: 12px;
        ">
          Ошибка загрузки изображения
        </div>
      `;
      parent.appendChild(errorDiv);
    }
  };

  if (component.imageSource) {
    return (
      <img 
        src={component.imageSource} 
        alt="Загруженное изображение"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
        onError={handleImageError}
        onDragStart={(e) => e.preventDefault()}
      />
    );
  }

  return (
    <div 
      className="image-placeholder"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#e9ecef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #6c757d',
        color: '#6c757d',
        fontSize: '12px',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      Изображение
    </div>
  );
};

export default ImageComponent;
