const IMAGE_BASE_URL = 'https://images.flavorflick.ca';

export const getImageUrl = (imageName: string): string => {
  return `${IMAGE_BASE_URL}/${imageName}.jpg`;
};