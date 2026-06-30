'use client'
import Image from 'next/image'

export default function GitHubSnake() {
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className='dark:hidden'>
        <Image 
          src="/github-contribution-snake/github-contribution-grid-snake.svg" 
          alt="GitHub contribution activity visualization"
          width={1000}
          height={200}
          priority={false}
          loading="lazy"
          className="h-auto w-[640px] max-w-none sm:w-full"
        />
      </div>
      <div className='hidden dark:block'>
        <Image 
          src="/github-contribution-snake/github-contribution-grid-snake-dark.svg" 
          alt="GitHub contribution activity visualization (dark mode)"
          width={1000}
          height={200}
          priority={false}
          loading="lazy"
          className="h-auto w-[640px] max-w-none sm:w-full"
        />
      </div>
    </div>
  )
}
