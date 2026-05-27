import { useState, useCallback, useRef, RefObject, useEffect } from 'react';
import { MoveState, Coordinates, SlideComponent } from '../types';
import { executeCommand, updateComponentPosition } from '../editor';

interface UseGroupDragProps {
  currentSlideId: string;
  workspaceRef: RefObject<HTMLDivElement | null>;
  moveState: MoveState | null;
  setMoveState: (state: MoveState | null) => void;
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

export const useGroupDrag = ({
  currentSlideId,
  workspaceRef,
  moveState,
  setMoveState
}: UseGroupDragProps) => {
  const [initialGroupCoordinates, setInitialGroupCoordinates] = useState<Map<string, Coordinates>>(new Map());
  const moveStateRef = useRef<MoveState | null>(null);
  const initialGroupCoordinatesRef = useRef<Map<string, Coordinates>>(new Map());

  useEffect(() => {
    moveStateRef.current = moveState;
  }, [moveState]);

  useEffect(() => {
    initialGroupCoordinatesRef.current = initialGroupCoordinates;
  }, [initialGroupCoordinates]);

  const startGroupDrag = useCallback((
    component: SlideComponent,
    componentsToMove: string[],
    initialCoordinates: Map<string, Coordinates>,
    offsetX: number,
    offsetY: number
  ) => {
    setInitialGroupCoordinates(initialCoordinates);
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

  const handleGroupDrag = useCallback((event: MouseEvent) => {
    const currentMoveState = moveStateRef.current;
    const currentInitialCoordinates = initialGroupCoordinatesRef.current;
    
    if (!currentMoveState?.moving || currentInitialCoordinates.size === 0) return;

    const { x: offsetX, y: offsetY } = getWorkspaceOffset(workspaceRef, event);
    const deltaX = offsetX - currentMoveState.moveStartX;
    const deltaY = offsetY - currentMoveState.moveStartY;
    
    currentInitialCoordinates.forEach((initialCoordinate, componentId) => {
      const newCoordinate: Coordinates = {
        x: Math.max(0, initialCoordinate.x + deltaX),
        y: Math.max(0, initialCoordinate.y + deltaY)
      };

      executeCommand(updateComponentPosition, {
        slideIdentifier: currentSlideId,
        componentIdentifier: componentId,
        newCoordinates: newCoordinate
      });
    });
  }, [currentSlideId, workspaceRef]);

  const stopGroupDrag = useCallback(() => {
    moveStateRef.current = null;
    setMoveState(null);
    setInitialGroupCoordinates(new Map());
  }, [setMoveState]);

  return {
    startGroupDrag,
    handleGroupDrag,
    stopGroupDrag,
    isDragging: moveState?.moving ?? false
  };
};
