
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { Icons, BLAZER_COLORS } from './constants';
import { ImageProcessingState, BlazerColor } from './types';
import { transformToHeadshot } from './services/geminiService';

export default function App() {
  const [state, setState] = useState<ImageProcessingState>({
    originalImage: null,
    processedImage: null,
    selectedColor: 'Navy Blue',
    isProcessing: false,
    error: null
  });

  const handleImageSelect = (base64: string) => {
    setState(prev => ({ 
      ...prev, 
      originalImage: base64, 
      processedImage: null, 
      error: null 
    }));
  };

  const handleProcess = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const result = await transformToHeadshot(state.originalImage, state.selectedColor);
      setState(prev => ({ 
        ...prev, 
        processedImage: result, 
        isProcessing: false 
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err.message || "Something went wrong while processing your image." 
      }));
    }
  };

  const downloadImage = () => {
    if (!state.processedImage) return;
    const link = document.createElement('a');
    link.href = state.processedImage;
    link.download = `professional-headshot-${state.selectedColor.toLowerCase().replace(' ', '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Icons.Sparkles />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HeadshotPro AI</h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            AI-Powered Corporate Transformation
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs">1</span>
                Upload Photo
              </h2>
              <ImageUploader onImageSelect={handleImageSelect} preview={state.originalImage} />
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs">2</span>
                Customize Attire
              </h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Select Blazer/Coat Colour
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {BLAZER_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setState(p => ({ ...p, selectedColor: color }))}
                      className={`
                        text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center justify-between
                        ${state.selectedColor === color 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-300 text-slate-600'}
                      `}
                    >
                      {color}
                      {state.selectedColor === color && <Icons.Check />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Button 
                  onClick={handleProcess} 
                  isLoading={state.isProcessing} 
                  disabled={!state.originalImage}
                  className="w-full h-14 text-lg"
                >
                  Generate Headshot
                </Button>
                {state.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    {state.error}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">Your Result</h2>
                {state.processedImage && (
                  <Button variant="secondary" onClick={downloadImage} className="!px-4 !py-2">
                    <Icons.Download /> Download
                  </Button>
                )}
              </div>

              <div className="flex-grow flex items-center justify-center p-8 bg-slate-100 relative">
                {state.isProcessing ? (
                  <div className="text-center space-y-4 max-w-xs animate-pulse">
                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                      <Icons.Sparkles />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Transforming Image...</h3>
                    <p className="text-slate-500">Our AI is applying studio lighting and fitting your new blazer. This usually takes 10-20 seconds.</p>
                  </div>
                ) : state.processedImage ? (
                  <div className="w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl relative group">
                    <img 
                      src={state.processedImage} 
                      alt="Professional Headshot" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                      <span>Ready for LinkedIn, Resume, or Team Pages</span>
                      <span className="flex items-center gap-1"><Icons.Check /> Studio Quality</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 opacity-40">
                    <div className="w-24 h-24 border-4 border-dashed border-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Icons.Camera />
                    </div>
                    <p className="text-lg font-medium text-slate-600">Your professional headshot will appear here</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-indigo-50/50">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4">Why use HeadshotPro AI?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 text-sm">Identity Preservation</p>
                    <p className="text-xs text-slate-500">Sophisticated AI keeps your unique facial structure unchanged.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 text-sm">Studio Lighting</p>
                    <p className="text-xs text-slate-500">Adds premium soft-box lighting found in professional studios.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 text-sm">Instant Results</p>
                    <p className="text-xs text-slate-500">Skip the photographer and expensive shoots; get results in seconds.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">&copy; 2024 HeadshotPro AI. Professional visual identity, simplified.</p>
        </div>
      </footer>
    </div>
  );
}
