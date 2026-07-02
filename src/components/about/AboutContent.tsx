"use client"

import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { useLocalizedContent } from "@/components/shared/useLocalizedContent"
import portraitImage from "@/images/portrait.jpg"

export function AboutContent() {
  const { about, profile } = useLocalizedContent()

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Portrait photo"
              width={320}
              height={320}
              sizes="(min-width: 1024px) 32rem, 20rem"
              placeholder="blur"
              className="aspect-square rotate-3 rounded-2xl bg-[#e6e9ef] object-cover dark:bg-[#313244]"
              priority={false}
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {about.headline}
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            {profile.aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
