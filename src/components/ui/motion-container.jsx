'use client';

import { motion } from 'framer-motion';

export function MotionDiv({ children, ...props }) {
    return <motion.div {...props}>{children}</motion.div>;
}

export function MotionContainer({ children }) {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6 px-4"
        >
            {children}
        </MotionDiv>
    );
}

export function MotionProgress({ percentageUsed }) {
    return (
        <MotionDiv
            initial={{ width: 0 }}
            animate={{ width: `${percentageUsed}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full transition-colors duration-300 ${percentageUsed > 90 ? "bg-red-500" :
                    percentageUsed > 70 ? "bg-yellow-500" :
                        "bg-gradient-to-r from-blue-500 to-blue-400"
                }`}
        />
    );
} 