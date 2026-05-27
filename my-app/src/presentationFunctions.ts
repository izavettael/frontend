import { 
  Presentation, 
  Slide, 
  TextObject, 
  Image, 
  Coordinates, 
  Dimensions 
} from './types';

export function updatePresentationTitle(presentation: Presentation, updatedTitle: string): Presentation {
  return { ...presentation, title: updatedTitle };
}

export function insertNewSlide(presentation: Presentation, newSlide: Slide): Presentation {
  console.log('Добавлен новый слайд:', newSlide.identifier);
  return { ...presentation, slides: [...presentation.slides, newSlide] };
}

export function deleteExistingSlide(presentation: Presentation, slideIdentifier: string): Presentation {
  console.log('Удален слайд:', slideIdentifier);
  return {
    ...presentation,
    slides: presentation.slides.filter((s) => s.identifier !== slideIdentifier),
  };
}

export function rearrangeSlide(presentation: Presentation, slideIdentifier: string, newPosition: number): Presentation {
  const slidesCollection = [...presentation.slides];
  const currentPosition = slidesCollection.findIndex((s) => s.identifier === slideIdentifier);
  if (currentPosition === -1 || newPosition < 0 || newPosition >= slidesCollection.length) {
    return presentation;
  }
  const [removedSlide] = slidesCollection.splice(currentPosition, 1);
  if (removedSlide) {
    slidesCollection.splice(newPosition, 0, removedSlide);
    return { ...presentation, slides: slidesCollection };
  }
  return presentation;
}

export function addTextComponent(presentation: Presentation, slideIdentifier: string, textComponent: TextComponent): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const updatedComponents = [...slide.components, textComponent];
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function addImageComponent(presentation: Presentation, slideIdentifier: string, imageComponent: ImageComponent): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const updatedComponents = [...slide.components, imageComponent];
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function removeComponent(presentation: Presentation, slideIdentifier: string, componentIdentifier: string): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const updatedComponents = slide.components.filter((c) => c.identifier !== componentIdentifier);
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateComponentPosition(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, newCoordinates: Coordinates): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  if (!component) {
    return presentation;
  }
  const updatedComponent = {
    ...component,
    coordinates: newCoordinates,
  };
  
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateComponentSize(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, newDimensions: Dimensions): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  
  const updatedComponent = {
    ...component,
    dimensions: newDimensions,
  } as TextComponent | ImageComponent;
  
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateTextContent(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, updatedContent: string): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  if (!component || component.kind !== 'text') {
    return presentation;
  }
  const updatedComponent: TextComponent = {
    ...component,
    textContent: updatedContent,
  };
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateTextSize(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, updatedFontSize: number): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  if (!component || component.kind !== 'text') {
    return presentation;
  }
  const updatedComponent: TextComponent = {
    ...component,
    textSize: updatedFontSize,
  };
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateTextFont(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, updatedFontFamily: string): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  if (!component || component.kind !== 'text') {
    return presentation;
  }
  const updatedComponent: TextComponent = {
    ...component,
    fontType: updatedFontFamily,
  };
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateTextColor(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, updatedColor: string): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  if (!component || component.kind !== 'text') {
    return presentation;
  }
  const updatedComponent: TextComponent = {
    ...component,
    textColor: updatedColor,
  };
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateSlideBackground(presentation: Presentation, slideIdentifier: string, updatedBackground: BackgroundSettings): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const updatedSlide: Slide = {
    ...slide,
    slideBackground: updatedBackground,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function updateImageSource(presentation: Presentation, slideIdentifier: string, componentIdentifier: string, updatedSource: string): Presentation {
  const slidePosition = presentation.slides.findIndex((s) => s.identifier === slideIdentifier);
  if (slidePosition === -1) {
    return presentation;
  }
  const slide = presentation.slides[slidePosition];
  if (!slide) {
    return presentation;
  }
  const componentPosition = slide.components.findIndex((c) => c.identifier === componentIdentifier);
  if (componentPosition === -1) {
    return presentation;
  }
  const component = slide.components[componentPosition];
  if (!component || component.kind !== 'image') {
    return presentation;
  }
  const updatedComponent: ImageComponent = {
    ...component,
    imageSource: updatedSource,
  };
  const updatedComponents = [...slide.components];
  updatedComponents[componentPosition] = updatedComponent;
  const updatedSlide: Slide = {
    ...slide,
    components: updatedComponents,
  };
  const updatedSlides = [...presentation.slides];
  updatedSlides[slidePosition] = updatedSlide;
  return { ...presentation, slides: updatedSlides };
}

export function generateDefaultSlide(slideNumber: number): Slide {
  return {
    identifier: `slide${slideNumber}`,
    slideBackground: {
      backgroundType: 'color', colorValue: '#ffffff',
      type: ''
    },
    components: []
  };
}

export function generateDefaultTextComponent(): TextComponent {
  return {
    identifier: `text${Date.now()}`,
    kind: 'text',
    coordinates: { x: 100, y: 100 },
    dimensions: { width: 200, height: 60 },
    textContent: 'Новый текст',
    fontType: 'Arial',
    textSize: 16,
    textColor: '#000000'
  };
}

export function generateDefaultImageComponent(): ImageComponent {
  return {
    identifier: `image${Date.now()}`,
    kind: 'image',
    coordinates: { x: 150, y: 150 }, 
    dimensions: { width: 200, height: 150 },
    imageSource: '' 
  };
}

export function addSlideAfterPosition(presentation: Presentation, afterPosition: number, newSlide: Slide): Presentation {
  const newSlidePosition = afterPosition + 1;
  const slidesCollection = [...presentation.slides];
  
  if (newSlidePosition >= slidesCollection.length) {
    slidesCollection.push(newSlide);
  } else {
    slidesCollection.splice(newSlidePosition, 0, newSlide);
  }
  
  console.log('Добавлен слайд после позиции:', afterPosition, 'новая позиция:', newSlidePosition);
  return { ...presentation, slides: slidesCollection };
}

// ========== ФУНКЦИИ ДЛЯ MAIN.TSX ==========

// Хранилище для текущей презентации
let currentPresentation: Presentation = {
  title: 'Новая презентация',
  slides: [],
  selection: {
    selectedSlideIds: [],
    selectedComponentIds: []
  }
};

// Коллекция обработчиков изменений
const changeHandlers: ((presentation: Presentation) => void)[] = [];

/**
 * Получить текущую презентацию
 */
export function getPresentation(): Presentation {
  return currentPresentation;
}

/**
 * Обновить презентацию
 */
export function setPresentation(newPresentation: Presentation): void {
  currentPresentation = newPresentation;
  // Уведомляем всех подписчиков об изменениях
  changeHandlers.forEach(handler => handler(currentPresentation));
}

/**
 * Добавить обработчик изменений презентации
 */
export function addEditorChangeHandler(callback: (presentation: Presentation) => void): void {
  changeHandlers.push(callback);
}

/**
 * Инициализировать тестовую презентацию
 */
export function initializeDefaultPresentation(): Presentation {
  const defaultSlide: Slide = {
    id: `slide-${Date.now()}`,
    backgroundColor: '#ffffff',
    elements: [
      {
        type: "text",
        id: `text-${Date.now()}`,
        content: 'Заголовок презентации',
        fontSize: 24,
        x: 100,
        y: 50,
        fontFamily: 'Arial',
        width: 300,
        height: 40
      }
    ],
    background: []
  };

  currentPresentation = {
    title: 'Моя презентация',
    slides: [defaultSlide],
    selection: {
      selectedSlideIds: [defaultSlide.id],
      selectedComponentIds: []
    }
  };

  return currentPresentation;
}

/**
 * Создать новый слайд
 */
export function createNewSlide(): Slide {
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    backgroundColor: '#ffffff',
    elements: [],
    background: []
  };
}

export function addNewSlide(presentation: Presentation, slide?: Slide): Presentation {
  const newSlide = slide || createNewSlide();
  return {
    ...presentation,
    slides: [...presentation.slides, newSlide]
  };
}

/**
 * Удалить слайд
 */
export function deleteSlide(presentation: Presentation, slideId: string): Presentation {
  return {
    ...presentation,
    slides: presentation.slides.filter(slide => slide.id !== slideId),
    selection: {
      ...presentation.selection,
      selectedSlideIds: presentation.selection.selectedSlideIds.filter(id => id !== slideId)
    }
  };
}