import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "~/utils/react";

export type AnimatedSkeletonListProps = {
  n?: number;
  className?: string;
};

const AnimatedSkeleton = motion.create(Skeleton);

export function AnimatedSkeletonList(props: AnimatedSkeletonListProps) {
  const { n = 5, className } = props;

  return Array.from({ length: n }).map((_, index) => {
    const MAX_STAGGER_DELAY_TOTAL = 0.7;
    const ITEM_ANIMATION_DURATION = 0.25;

    const normalizedIndex = n > 1 ? index / (n - 1) : 0;

    const easedDelay = Math.pow(normalizedIndex, 3) * MAX_STAGGER_DELAY_TOTAL;

    return (
      <AnimatePresence key={index}>
        <AnimatedSkeleton
          layout
          initial={{ opacity: 0 }}
          transition={{
            ease: "easeIn",
            duration: ITEM_ANIMATION_DURATION,
            delay: easedDelay,
          }}
          className={cn(className, "h-12")}
          animate={{ opacity: 1 }}
        />
      </AnimatePresence>
    );
  });
}
