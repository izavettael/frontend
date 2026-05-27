export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface TextObject {
  type: "text";
  id: string;
  content: string;
  fontSize: number;
  x: number;
  y: number;
  fontFamily: string;
  width: number;
  height: number;
}

export interface Image {
  type: "image";
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SlideElement = TextObject | Image;

export interface Slide {
  id: string;
  elements: SlideElement[];
  background: Image[];
  backgroundColor: string;
}

export interface Presentation {
  title: string;
  slides: Slide[];
  selection: {
    selectedSlideIds: string[];
    selectedComponentIds: string[];
  };
}

export interface MoveState {
  moving: boolean;
  moveStartX: number;
  moveStartY: number;
  originalX: number;
  originalY: number;
  componentIds: string[];
}

export interface SelectionState {
  selectedSlideId: string | null;
  selectedComponentIds: string[];
}