import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface UseCaseCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  metrics: string;
  index?: number;
  className?: string;
}

export function UseCaseCard({
  icon,
  title,
  description,
  metrics,
  index = 0,
  className
}: UseCaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn("group h-full", className)}
    >
      <div className="glass-card h-full p-8 transition-all duration-300 hover:shadow-premium">
        <div className="flex items-start space-x-fluid-md">
          {/* Icon Container with Animation */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative flex-shrink-0"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20">
              <div className="text-primary">
                {icon}
              </div>
            </div>
          </motion.div>
          
          {/* Content */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
            
            {/* Metrics Badge */}
            <div className="inline-flex items-center">
              <span className="badge-premium text-sm">
                {metrics}
              </span>
            </div>
          </div>
        </div>
        
        {/* Hover Effect Line */}
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent"
        />
      </div>
    </motion.div>
  );
}

