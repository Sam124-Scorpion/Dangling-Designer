export default function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900 flex items-center justify-center text-xs font-medium text-brand-800 dark:text-brand-200 shrink-0">
        ST
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}
