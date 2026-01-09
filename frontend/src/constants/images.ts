const IMAGE_BASE_URL = 'https://pub-af72fc9e72384cd7b527039f8176c9b2.r2.dev';

export const getImageUrl = (imageName: string): string => {
  return `${IMAGE_BASE_URL}/${imageName}.jpg`;
};