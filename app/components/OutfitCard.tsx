'use client'
import { Outfit } from '@/lib/types'

export default function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gray-50 dark:bg-gray-700 overflow-hidden">
        {outfit.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={outfit.image_url}
            alt={outfit.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">{outfit.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{outfit.description}</p>
        <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1">{outfit.price}</p>

        <a
          href={outfit.buy_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-center text-xs font-medium py-2 px-3 rounded-lg bg-brand-50 dark:bg-brand-900 text-brand-800 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
        >
          {outfit.buy_label || 'Shop now'} →
        </a>
      </div>
    </div>
  )
}
