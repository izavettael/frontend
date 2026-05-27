import { TextObject as TextComponentType } from '../types';

interface TextComponentProps {
  component: TextComponentType;
  isEditing: boolean;
  editTextContent: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const TextObject = ({
  component,
  isEditing,
  editTextContent,
  onTextChange,
  onKeyDown,
  onBlur,
  inputRef
}: TextComponentProps) => {
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editTextContent}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className="text-edit-field"
        placeholder="Введите текст..."
        style={{
          fontFamily: component.fontType,
          fontSize: `${component.textSize}px`,
          color: component.textColor,
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'transparent',
          outline: 'none'
        }}
      />
    );
  }

  return (
    <div 
      className="text-component-content"
      style={{
        fontFamily: component.fontType,
        fontSize: `${component.textSize}px`,
        color: component.textColor,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        padding: '5px',
        whiteSpace: 'nowrap',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '3px'
      }}
    >
      {component.textContent || 'Двойной клик для редактирования'}
    </div>
  );
};

export default TextObject;
