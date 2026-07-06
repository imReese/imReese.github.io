'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedFaviconProps {
  url: string
  size?: number
  alt?: string
}

export function OptimizedFavicon({ url, size = 36, alt }: OptimizedFaviconProps) {
  const [imageError, setImageError] = useState(false)
  
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    const faviconUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`
    const customAlt = alt || `${domain} favicon`

    if (imageError) {
      return (
        <div 
          className="flex items-center justify-center rounded-full bg-muted"
          style={{ width: size, height: size }}
        >
          <span className="text-xs text-muted-foreground">
            {domain.charAt(0).toUpperCase()}
          </span>
        </div>
      )
    }

    return (
      <Image
        src={faviconUrl}
        alt={customAlt}
        width={size}
        height={size}
        className="rounded-full"
        loading="lazy"
        onError={() => setImageError(true)}
        style={{ 
          width: size, 
          height: size,
          objectFit: 'contain'
        }}
      />
    )
  } catch {
    // URL解析失败时显示默认占位符
    return (
      <div 
        className="flex items-center justify-center rounded-full bg-muted"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground">🌐</span>
      </div>
    )
  }
}
