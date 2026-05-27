import { useCallback, useRef, RefObject, useEffect } from 'react';
import { MoveState, ResizeAction, SlideComponent, Dimensions, Coordinates } from '../types';
import { executeCommand, updateComponentPosition, updateComponentSize } from '../editor';

const MIN_COMPONENT_SIZE = 20;

interface UseDragAndDropProps {
  currentSlideId: string;
  workspaceRef: RefObject<HTMLDivElement | null>;
  moveState: MoveState | null;
  setMoveState: (state: MoveState | null) => void;
  resizeAction: ResizeAction | null;
  setResizeAction: (state: ResizeAction | null) => void;
}

const getWorkspaceOffset = (
  workspaceRef: RefObject<HTMLDivElement | null>,
  event: MouseEvent
): { x: number; y: number } => {
  const workspaceBounds = workspaceRef.current?.getBoundingClientRect();
  if (!workspaceBounds) return { x: 0, y: 0 };
  return {
    x: event.clientX - workspaceBounds.left,
    y: event.clientY - workspaceBounds.top
  };
};

const calculateResizeDimensions = (
  corner: string,
  deltaX: number,
  deltaY: number,
  originalWidth: number,
  originalHeight: number,
  originalX: number,
  originalY: number
): { width: number; height: number; x: number; y: number; shouldUpdatePosition: boolean } => {
  let newWidth = originalWidth;
  let newHeight = originalHeight;
  let newX = originalX;
  let newY = originalY;
  let shouldUpdatePosition = false;

  switch (corner) {
    case 'top-left':
      newWidth = Math.max(MIN_COMPONENT_SIZE, originalWidth - deltaX);
      newHeight = Math.max(MIN_COMPONENT_SIZE, originalHeight - deltaY);
      newX = originalX + (originalWidth - newWidth);
      newY = originalY + (originalHeight - newHeight);
      shouldUpdatePosition = true;
      break;
    case 'top-right':
      newWidth = Math.max(MIN_COMPONENT_SIZE, originalWidth + deltaX);
      newHeight = Math.max(MIN_COMPONENT_SIZE, originalHeight - deltaY);
      newY = originalY + (originalHeight - newHeight);
      shouldUpdatePosition = true;
      break;
    case 'bottom-left':
      newWidth = Math.max(MIN_COMPONENT_SIZE, originalWidth - deltaX);
      newHeight = Math.max(MIN_COMPONENT_SIZE, originalHeight + deltaY);
      newX = originalX + (originalWidth - newWidth);
      shouldUpdatePosition = true;
      break;
    case 'bottom-right':
      newWidth = Math.max(MIN_COMPONENT_SIZE, originalWidth + deltaX);
      newHeight = Math.max(MIN_COMPONENT_SIZE, originalHeight + deltaY);
      shouldUpdatePosition = false;
      break;
    case 'top':
      newHeight = Math.max(MIN_COMPONENT_SIZE, originalHeight - deltaY);
      newY = originalY + (originalHeight - newHeight);
      shouldUpdatePosition = true;
      break;
    case 'bottom':
      newHeight = Math.max(MIN_COMPONENT_SIZE, originalHeight + deltaY);
      shouldUpdatePosition = false;
      break;
    case 'left':
      newWidth = Math.max(MIN_COMPONENT_SIZE, originalWidth - deltaX);
      newX = originalX + (originalWidth - newWidth);
      shouldUpdatePosition = true;
      break;
    case 'right':
      newWidth = Math.max(MIN_COMPONENT_SIZE, originalWidth + deltaX);
      shouldUpdatePosition = false;
      break;
  }

  return { width: newWidth, height: newHeight, x: newX, y: newY, shouldUpdatePosition };
};

export const useDragAndDrop = ({
  currentSlideId,
  workspaceRef,
  moveState,
  setMoveState,
  resizeAction,
  setResizeAction
}: UseDragAndDropProps) => {
  const moveStateRef = useRef<MoveState | null>(null);
  const resizeActionRef = useRef<ResizeAction | null>(null);
  const initialCoordinatesRef = useRef<Coordinates | null>(null);

  useEffect(() => {
    moveStateRef.current = moveState;
    resizeActionRef.current = resizeAction;
  }, [moveState, resizeAction]);

  const startDrag = useCallback((
    component: SlideComponent,
    offsetX: number,
    offsetY: number
  ) => {
    initialCoordinatesRef.current = { x: component.coordinates.x, y: component.coordinates.y };
    const newMoveState: MoveState = {
      moving: true,
      moveStartX: offsetX,
      moveStartY: offsetY,
      originalX: component.coordinates.x,
      originalY: component.coordinates.y,
      componentIdentifier: component.identifier
    };
    moveStateRef.current = newMoveState;
    setMoveState(newMoveState);
  }, [setMoveState]);

  const startResize = useCallback((
    component: SlideComponent,
    cornerType: string,
    offsetX: number,
    offsetY: number
  ) => {
    const newResizeAction: ResizeAction = {
      resizing: true,
      resizeCorner: cornerType,
      originalWidth: component.dimensions.width,
      originalHeight: component.dimensions.height,
      originalX: component.coordinates.x,
      originalY: component.coordinates.y,
      startX: offsetX,
      startY: offsetY,
      componentIdentifier: component.identifier
    };
    resizeActionRef.current = newResizeAction;
    setResizeAction(newResizeAction);
  }, [setResizeAction]);

  const handleDrag = useCallback((event: MouseEvent) => {
    const currentMoveState = moveStateRef.current;
    const initialCoordinate = initialCoordinatesRef.current;
    
    if (!currentMoveState?.moving || !initialCoordinate) return;

    const { x: offsetX, y: offsetY } = getWorkspaceOffset(workspaceRef, event);
    const deltaX = offsetX - currentMoveState.moveStartX;
    const deltaY = offsetY - currentMoveState.moveStartY;
    
    const newCoordinate: Coordinates = {
      x: Math.max(0, initialCoordinate.x + deltaX),
      y: Math.max(0, initialCoordinate.y + deltaY)
    };

    executeCommand(updateComponentPosition, {
      slideIdentifier: currentSlideId,
      componentIdentifier: currentMoveState.componentIdentifier,
      newCoordinates: newCoordinate
    });
  }, [currentSlideId, workspaceRef]);

  const handleResize = useCallback((event: MouseEvent) => {
    const currentResizeAction = resizeActionRef.current;
    if (!currentResizeAction?.resizing) return;

    const { x: offsetX, y: offsetY } = getWorkspaceOffset(workspaceRef, event);
    const deltaX = offsetX - currentResizeAction.startX;
    const deltaY = offsetY - currentResizeAction.startY;

    const { width: newWidth, height: newHeight, x: newX, y: newY, shouldUpdatePosition } = 
      calculateResizeDimensions(
        currentResizeAction.resizeCorner,
        deltaX,
        deltaY,
        currentResizeAction.originalWidth,
        currentResizeAction.originalHeight,
        currentResizeAction.originalX,
        currentResizeAction.originalY
      );

    const newDimensions: Dimensions = { width: newWidth, height: newHeight };

    executeCommand(updateComponentSize, {
      slideIdentifier: currentSlideId,
      componentIdentifier: currentResizeAction.componentIdentifier,
      newDimensions: newDimensions
    });

    if (shouldUpdatePosition) {
      const newCoordinate: Coordinates = { x: newX, y: newY };
      executeCommand(updateComponentPosition, {
        slideIdentifier: currentSlideId,
        componentIdentifier: currentResizeAction.componentIdentifier,
        newCoordinates: newCoordinate
      });
    }
  }, [currentSlideId, workspaceRef]);

  const stopDrag = useCallback(() => {
    moveStateRef.current = null;
    initialCoordinatesRef.current = null;
    setMoveState(null);
  }, [setMoveState]);

  const stopResize = useCallback(() => {
    resizeActionRef.current = null;
    setResizeAction(null);
  }, [setResizeAction]);

  return {
    startDrag,
    startResize,
    handleDrag,
    handleResize,
    stopDrag,
    stopResize,
    isDragging: moveState?.moving ?? false,
    isResizing: resizeAction?.resizing ?? false
  };
};
