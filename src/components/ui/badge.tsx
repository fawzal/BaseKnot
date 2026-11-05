import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase border transition-colors select-none',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200',
        secondary:
          'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900',
        outline:
          'border-zinc-200 text-zinc-600 bg-transparent hover:border-zinc-300 hover:text-zinc-900',
        destructive:
          'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
        research:
          'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100',
        feature:
          'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
        sitemap:
          'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100',
        token:
          'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
