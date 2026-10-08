interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

const ProductGridSkeleton = ({ count = 6, className = "" }: ProductGridSkeletonProps) => {
  const placeholders = Array.from({ length: count }, (_, index) => index);

  return (
    <div className={className} aria-hidden="true">
      {placeholders.map((placeholder) => (
        <div key={placeholder}>
          <div className="skeleton aspect-square w-full" />
          <div className="mt-4 flex justify-between gap-4">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-5 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
