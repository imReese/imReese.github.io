"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { EducationItemType, educationList } from '@/config/infoConfig'
import { CustomIcon } from '@/components/shared/CustomIcon'

function EducationItem({ educationItem, isExpanded, onClick }: { 
  educationItem: EducationItemType 
  isExpanded: boolean
  onClick: () => void
}) {
  return (
    <motion.li>
      <motion.div
        className={`flex cursor-pointer gap-4 rounded-xl p-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isExpanded ? 'bg-primary/10 shadow-sm' : 'hover:bg-secondary/70'
        }`}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick()
          }
        }}
      >
        <div className="relative mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-full shadow-md border border-muted bg-background">
          <CustomIcon name={educationItem.logo} size={20} />
        </div>
        
        <div className="flex flex-auto flex-col gap-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-foreground">{educationItem.school}</h4>
              <p className="text-sm text-muted-foreground">{educationItem.major}</p>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight size={16} className="text-muted-foreground" />
            </motion.div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">
                    {educationItem.start} - {educationItem.end}
                  </span>
                  <span className="rounded-full bg-[hsl(var(--chart-3))]/10 px-2 py-1 text-xs font-medium text-[hsl(var(--chart-3))]">
                    Bachelor&apos;s Degree
                  </span>
                </div>
                
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  <p>Computer science fundamentals, algorithms, software engineering, and systems programming foundations.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.li>
  )
}

export default function AnimatedEducation() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <motion.div 
      className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.h2 
        className="flex items-center text-lg font-semibold mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <GraduationCap size={20} className="mr-3" />
        Education
      </motion.h2>
      
      <motion.ol 
        className="space-y-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {educationList.map((educationItem, index) => (
          <EducationItem
            key={index}
            educationItem={educationItem}
            isExpanded={expandedIndex === index}
            onClick={() => toggleExpand(index)}
          />
        ))}
      </motion.ol>
      
      {/* 添加查看更多信息的链接 */}
      <motion.div 
        className="mt-6 pt-4 border-t border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <a 
          href="/about" 
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View complete education background
          <ArrowRight size={16} className="ml-1" />
        </a>
      </motion.div>
    </motion.div>
  )
}
