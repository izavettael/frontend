import type { Presentation } from './types';

export const samplePresentation: Presentation = {
  title: 'Моя презентация',
  slides: [
    {
      identifier: 'slide1',
      slideBackground: {
        backgroundType: 'color', colorValue: '#ffffff',
        type: ''
      },
      components: []
    },
    {
      identifier: 'slide2',
      slideBackground: {
        backgroundType: 'color', colorValue: '#ffffff',
        type: ''
      },
      components: []
    }
  ],
};