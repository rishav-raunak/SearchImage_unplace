import React from 'react';
import { Check } from 'lucide-react';


function ImageItem({ result, onSelect, isSelected }) {
  const { urls, alt_description } = result;

  return (
    <div
      className={`relative aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer group ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
      onClick={() => onSelect(result.id)}
    >
      <img
        src={urls.small}
        alt={alt_description || 'Unsplash Image'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          isSelected ? 'bg-blue-500' : 'bg-white bg-opacity-30 group-hover:bg-opacity-70'
        }`}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>
    </div>
  );
}


export default function ImageResults({ results, isLoading, error, searchStatus, selectedImages, onToggleSelection }) {
  return (
    <div className="p-4 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <span className="text-sm text-gray-700 dark:text-gray-300">{searchStatus}</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          Selected: {selectedImages.length} images
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && !error && <p className="text-gray-500 text-center col-span-full">Loading...</p>}
        {error && <p className="text-red-500 text-center col-span-full">{error}</p>}
        {!isLoading && !error && results.length > 0 &&
          results.map((result) => (
            <ImageItem
              key={result.id}
              result={result}
              onSelect={onToggleSelection}
              isSelected={selectedImages.includes(result.id)}
            />
          ))}
      </div>
    </div>
  );
}
