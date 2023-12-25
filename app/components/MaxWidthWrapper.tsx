import { cn } from "@/lib/utils";

interface MaxWidthWrapperInterface {
  className?: string;
  children: React.ReactNode;
}

const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperInterface) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
