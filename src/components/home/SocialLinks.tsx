'use client'

import { email, socialLinks } from '@/config/infoConfig'
import { utm_source } from '@/config/siteConfig'
import Link from 'next/link'
import { CustomIcon } from '@/components/shared/CustomIcon'
import { cn } from '@/lib/utils'
import { withUtmSource } from '@/lib/externalLinks'
import wechatQrImage from '@/images/wechat.jpg'

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn('mt-6 flex items-center', className)}>
      {socialLinks.map((link) => (
        <Link
          key={link.name}
          href={withUtmSource(link.href, utm_source)}
          target="_blank"
          rel="noreferrer"
          aria-label={link.ariaLabel ?? `Follow on ${link.name}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150 hover:bg-accent-soft hover:text-primary"
        >
          <CustomIcon name={link.icon} />
          <span className="sr-only">{link.name}</span>
        </Link>
      ))}
      <Link
        href={wechatQrImage.src}
        target="_blank"
        rel="noreferrer"
        aria-label="Open WeChat QR code"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150 hover:bg-accent-soft hover:text-primary"
      >
        <CustomIcon name="wechat" />
        <span className="sr-only">WeChat QR code</span>
      </Link>
      <Link
        href={`mailto:${email}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Email"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150 hover:bg-accent-soft hover:text-primary"
      >
        <CustomIcon name="email" />
        <span className="sr-only">Email</span>
      </Link>
    </div>
  )
}
