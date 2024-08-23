import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

function OptionCard({
  icon,
  title,
  name,
  description,
  onPressHandler,
  currentType,
}: {
  icon: React.ReactNode;
  title: string;
  name: string;
  description: string;
  onPressHandler: () => void;
  currentType: any;
}) {
  return (
    <Card
      onClick={onPressHandler}
      className={cn("p-6 pt-10 bg-bg-2 w-[248px] cursor-pointer", currentType === name ? "border border-white/30" : "border border-white/10",)}
    >
      <div className="flex h-full w-full flex-row lg:flex-col lg:items-center lg:justify-evenly">
        <div
          className={cn(
            "my-auto aspect-square h-fit w-fit rounded-2xl p-4 transition duration-300",
            currentType === name ? "bg-[#BC7F44] text-white" : "bg-bg-3 text-icon-3",
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-2 items-center mt-10">
          <h1 className="font-medium text-white ">{title}</h1>
          <span className="text-[13px] text-text-additional md:text-center ">{description}</span>
        </div>
      </div>
    </Card>
  );
}
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, OptionCard }
