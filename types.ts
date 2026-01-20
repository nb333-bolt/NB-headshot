
export type BlazerColor = 
  | 'Navy Blue' 
  | 'Charcoal Grey' 
  | 'Deep Black' 
  | 'Soft Beige' 
  | 'Olive Green' 
  | 'Burgundy' 
  | 'Slate Blue' 
  | 'Warm Taupe';

export interface ImageProcessingState {
  originalImage: string | null;
  processedImage: string | null;
  selectedColor: BlazerColor;
  isProcessing: boolean;
  error: string | null;
}
