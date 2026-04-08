'use client'
import { Message } from '@/lib/types'
import OutfitCard from './OutfitCard'

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex gap-2 items-start justify-end">
        <div className="max-w-[75%] bg-brand-50 dark:bg-brand-900 text-brand-900 dark:text-brand-100 rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
          {message.content}
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900 flex items-center justify-center text-xs font-medium text-emerald-800 dark:text-emerald-200 shrink-0">
          ME
        </div>
      </div>
    )
  }

  const data = message.parsed

  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900 flex items-center justify-center text-xs font-medium text-brand-800 dark:text-brand-200 shrink-0">
        DD
      </div>
      <div className="max-w-[85%] flex flex-col gap-3">
        {data ? (
          <>
            {data.message && (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                {data.message}
              </div>
            )}

            {data.outfits && data.outfits.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.outfits.map((outfit, i) => (
                  <OutfitCard key={i} outfit={outfit} />
                ))}
              </div>
            )}

            {data.followup && (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-500 dark:text-gray-400 italic">
                {data.followup}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {message.content}
          </div>
        )}
      </div>
    </div>
  )
}
