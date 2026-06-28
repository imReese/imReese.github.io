"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, ArrowRight } from 'lucide-react'
import { CareerItemType, careerList } from '@/config/infoConfig'
import { CustomIcon } from '@/components/shared/CustomIcon'

function CareerItem({ careerItem, isExpanded, onClick }: { 
  careerItem: CareerItemType 
  isExpanded: boolean
  onClick: () => void
}) {
  return (
    <motion.li 
      className={`flex gap-4 rounded-xl p-4 transition-all duration-300 ${
        isExpanded ? 'bg-primary/10 shadow-sm' : 'hover:bg-secondary/70'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-full shadow-md border border-muted bg-background">
        <CustomIcon name={careerItem.logo} size={20} />
      </div>
      
      <div className="flex flex-auto flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-foreground">{careerItem.company}</h4>
            <p className="text-sm text-muted-foreground">{careerItem.title}</p>
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
                  {careerItem.start} - {careerItem.end}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Full-time
                </span>
              </div>
              
              {/* 这里可以添加更多详细信息 */}
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Backend product engineering with a focus on reliable services, internal tooling, and production operations.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  )
}

export default function AnimatedCareer() {
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
        <Briefcase size={20} className="mr-3" />
        Work Experience
      </motion.h2>
      
      <motion.ol 
        className="space-y-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {careerList.map((careerItem, index) => (
          <CareerItem
            key={index}
            careerItem={careerItem}
            isExpanded={expandedIndex === index}
            onClick={() => toggleExpand(index)}
          />
        ))}
      </motion.ol>
      
      {/* 添加查看完整简历的链接 */}
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
          View full work history
          <ArrowRight size={16} className="ml-1" />
        </a>
      </motion.div>
    </motion.div>
  )
}
