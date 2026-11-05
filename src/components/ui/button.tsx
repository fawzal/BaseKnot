import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-colors outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 focus-visible:ring-1 focus-visible:ring-zinc-900',
  {
    variants: {
      variant: {
        // High-Contrast Solid Ink (Linear / Vercel Light Mode standard)
        default:
          'bg-zinc-900 text-white font-medium hover:bg-zinc-800 active:bg-zinc-950 shadow-sm border border-zinc-900',
        subtle:
          'bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900',
        secondary:
          'bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900',
        outline:
          'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm',
        ghost:
          'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
        icon:
          'bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100',
        glow:
          'bg-zinc-900 text-white font-medium hover:bg-zinc-800 active:bg-zinc-950 shadow-sm',
        destructive:
          'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:text-red-800',
        research:
          'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100',
        feature:
          'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
        sitemap:
          'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100',
        token:
          'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100',
      },
      size: {
        default: 'h-8 px-3.5 py-1.5 gap-1.5',
        sm: 'h-7 px-2.5 text-[11px] rounded-md gap-1',
        lg: 'h-9 px-4 text-xs rounded-lg gap-2',
        icon: 'h-8 w-8 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
