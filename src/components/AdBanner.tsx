import { cn } from "@/lib/utils";

interface AdBannerProps {
  type: 'horizontal' | 'square' | 'popup';
  className?: string;
}

export function AdBanner({ type, className }: AdBannerProps) {
  const getAdDimensions = () => {
    switch (type) {
      case 'horizontal':
        return 'w-full h-[90px]';
      case 'square':
        return 'w-[300px] h-[250px]';
      case 'popup':
        return 'w-[300px] h-[600px]';
      default:
        return '';
    }
  };

  return (
    <div 
      className={cn(
        "bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center",
        getAdDimensions(),
        className
      )}
    >
      <div className="text-center text-gray-500">
        <p className="text-sm font-medium">Advertisement</p>
        <p className="text-xs mt-1">{type.toUpperCase()} Ad Space</p>
        <p className="text-xs mt-1">300x250</p>
      </div>
    </div>
  );
} 