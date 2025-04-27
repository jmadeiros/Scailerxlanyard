declare module 'lucide-react' {
  import { ComponentType } from 'react';

  interface IconProps {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    className?: string;
  }

  type Icon = ComponentType<IconProps>;

  export const Menu: Icon;
  export const X: Icon;
  export const Check: Icon;
  export const Loader2: Icon;
  export const User: Icon;
  export const AlertCircle: Icon;
  export const ArrowRight: Icon;
  export const TrendingUp: Icon;
  export const Users: Icon;
  export const Target: Icon;
  export const Zap: Icon;
  export const Globe: Icon;
  export const Calendar: Icon;
  export const Clock: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const FileText: Icon;
  export const Image: Icon;
  export const BarChart: Icon;
} 