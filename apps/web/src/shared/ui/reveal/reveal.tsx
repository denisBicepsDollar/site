'use client'
import {motion} from 'framer-motion';
import {ReactNode} from 'react';

export function Reveal({
                           children,
                           delay = 0,
                           y = 28,
                           className = '',
                       }) {
    return (
        <motion.div
            className={className}
            initial={{opacity: 0, y}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-70px'}}
            transition={{duration: 0.8, delay, ease: [0.22, 1, 0.36, 1]}}
        >
            {children}
        </motion.div>
    );
}

export function Eyebrow({
                            children,
                            light = false,
                        }) {
    return (
        <div className="flex items-center gap-3">
            <span className={`h-px w-10 ${light ? 'bg-cream/40' : 'bg-clay'}`}/>
            <span
                className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${
                    light ? 'text-cream/70' : 'text-leaf'
                }`}
            >
        {children}
      </span>
        </div>
    );
}
