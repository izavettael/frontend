import { SlideComponent } from '../types';

interface ResizeCornersProps {
  component: SlideComponent;
  isVisible: boolean;
}

const RESIZE_CORNERS = [
  { corner: 'top-left', style: { top: -4, left: -4 } },
  { corner: 'top-right', style: { top: -4, right: -4 } },
  { corner: 'bottom-left', style: { bottom: -4, left: -4 } },
  { corner: 'bottom-right', style: { bottom: -4, right: -4 } },
  { corner: 'top', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
  { corner: 'bottom', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
  { corner: 'left', style: { left: -4, top: '50%', transform: 'translateY(-50%)' } },
  { corner: 'right', style: { right: -4, top: '50%', transform: 'translateY(-50%)' } },
];

const ResizeCorners = ({ component, isVisible }: ResizeCornersProps) => {
  if (!isVisible) return null;

  return (
    <>
      {RESIZE_CORNERS.map(({ corner, style }) => (
        <div
          key={corner}
          className="resize-corner"
          data-corner={corner}
          style={style}
        />
      ))}
    </>
  );
};

export default ResizeCorners;
