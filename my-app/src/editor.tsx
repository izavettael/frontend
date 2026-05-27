import { Presentation, Slide, TextComponent, ImageComponent, BackgroundSettings, Coordinates, Dimensions } from './types';
import { 
  updatePresentationTitle as renamePresentation,
  insertNewSlide,
  deleteExistingSlide,
  addTextComponent,
  addImageComponent,
  removeComponent,
  updateSlideBackground as changeSlideBackground, 
  generateDefaultSlide,
  generateDefaultTextComponent,
  generateDefaultImageComponent,
  updateTextContent,
  updateImageSource,
  updateComponentPosition as updateComponentPositionFunc,
  updateComponentSize as updateComponentSizeFunc,
  rearrangeSlide as rearrangeSlideFunc,
  addSlideAfterPosition
} from './presentationFunctions';

let editorState: Presentation = {
  title: 'Моя презентация',
  slides: [generateDefaultSlide(1), generateDefaultSlide(2)]
};

let editorUpdateListener: (() => void) | null = null;

export function getEditorState(): Presentation {
  return editorState;
}

export function setEditorState(newEditorState: Presentation): void {
  editorState = newEditorState;
}

export function addEditorUpdateListener(listener: (() => void) | null): void {
  editorUpdateListener = listener;
}

export function executeCommand(modifyFunction: (editor: Presentation, payload?: any) => Presentation, payload?: any): void {
  const updatedEditor = modifyFunction(editorState, payload);
  setEditorState(updatedEditor);
  
  if (editorUpdateListener) {
    editorUpdateListener();
  }
}

export function updatePresentationTitle(editor: Presentation, newTitle: string): Presentation {
  return renamePresentation(editor, newTitle);
}

export function createNewSlide(editor: Presentation): Presentation {
  const newSlide = generateDefaultSlide(editor.slides.length + 1);
  return insertNewSlide(editor, newSlide);
}

export function removeCurrentSlide(editor: Presentation, slidePosition: number): Presentation {
  if (editor.slides.length <= 1) return editor;
  const slideIdentifier = editor.slides[slidePosition]?.identifier;
  if (!slideIdentifier) return editor;
  return deleteExistingSlide(editor, slideIdentifier);
}

export function insertTextComponent(editor: Presentation, slidePosition: number): Presentation {
  const slide = editor.slides[slidePosition];
  if (!slide) return editor;
  const textComponent = generateDefaultTextComponent();
  return addTextComponent(editor, slide.identifier, textComponent);
}

export function insertImageComponent(editor: Presentation, slidePosition: number): Presentation {
  const slide = editor.slides[slidePosition];
  if (!slide) return editor;
  const imageComponent = generateDefaultImageComponent();
  return addImageComponent(editor, slide.identifier, imageComponent);
}

export function insertCustomImageComponent(editor: Presentation, payload: { slidePosition: number; imageData: string }): Presentation {
  const slide = editor.slides[payload.slidePosition];
  if (!slide) return editor;
  const imageComponent: ImageComponent = {
    identifier: `image${Date.now()}`,
    kind: 'image',
    coordinates: { x: 100, y: 100 },
    dimensions: { width: 200, height: 150 },
    imageSource: payload.imageData
  };
  return addImageComponent(editor, slide.identifier, imageComponent);
}

export function deletePickedComponent(editor: Presentation, payload: { slidePosition: number; componentIdentifier: string }): Presentation {
  const slide = editor.slides[payload.slidePosition];
  if (!slide) return editor;
  return removeComponent(editor, slide.identifier, payload.componentIdentifier);
}

export function updateSlideBackground(editor: Presentation, payload: { slidePosition: number; background: BackgroundSettings }): Presentation {
  const slide = editor.slides[payload.slidePosition];
  if (!slide) return editor;
  return changeSlideBackground(editor, slide.identifier, payload.background); // Использую переименованный импорт
}

export function modifyTextContent(editor: Presentation, payload: { 
  slidePosition: number; 
  componentIdentifier: string; 
  updatedContent: string 
}): Presentation {
  const slide = editor.slides[payload.slidePosition];
  if (!slide) return editor;
  return updateTextContent(editor, slide.identifier, payload.componentIdentifier, payload.updatedContent);
}

export function modifyImageSource(editor: Presentation, payload: { 
  slidePosition: number; 
  componentIdentifier: string; 
  updatedSource: string 
}): Presentation {
  const slide = editor.slides[payload.slidePosition];
  if (!slide) return editor;
  return updateImageSource(editor, slide.identifier, payload.componentIdentifier, payload.updatedSource);
}

export function updateComponentPosition(editor: Presentation, payload: {
  slideIdentifier: string;
  componentIdentifier: string;
  newCoordinates: Coordinates;
}): Presentation {
  return updateComponentPositionFunc(editor, payload.slideIdentifier, payload.componentIdentifier, payload.newCoordinates);
}

export function updateComponentSize(editor: Presentation, payload: {
  slideIdentifier: string;
  componentIdentifier: string;
  newDimensions: Dimensions;
}): Presentation {
  return updateComponentSizeFunc(editor, payload.slideIdentifier, payload.componentIdentifier, payload.newDimensions);
}

export function updateSlideOrder(editor: Presentation, payload: {
  slideIdentifier: string;
  newPosition: number;
}): Presentation {
  return rearrangeSlideFunc(editor, payload.slideIdentifier, payload.newPosition);
}

export function addSlideAfterCurrent(editor: Presentation, afterPosition: number): Presentation {
  const newSlide = generateDefaultSlide(editor.slides.length + 1);
  return addSlideAfterPosition(editor, afterPosition, newSlide);
}

export function moveSlidesGroup(editor: Presentation, payload: {
  slideIdentifiers: string[];
  targetPosition: number;
}): Presentation {
  const { slideIdentifiers, targetPosition } = payload;
  
  const movingPositions = slideIdentifiers.map(slideIdentifier => 
    editor.slides.findIndex(slide => slide.identifier === slideIdentifier)
  ).filter(position => position !== -1).sort((a, b) => a - b);

  if (movingPositions.length === 0) return editor;

  const slidesCollection = [...editor.slides];
  
  const movingSlides = movingPositions.map(position => slidesCollection[position]);
  movingPositions.sort((a, b) => b - a).forEach(position => {
    slidesCollection.splice(position, 1);
  });

  slidesCollection.splice(targetPosition, 0, ...movingSlides);

  return {
    ...editor,
    slides: slidesCollection
  };
}