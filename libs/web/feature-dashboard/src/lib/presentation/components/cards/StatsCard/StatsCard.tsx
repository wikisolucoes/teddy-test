import { Card, CardContent, cn } from '@teddy-monorepo/web/shared';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'orange';
  className?: string;
}

const colorClasses = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  red: 'text-red-500',
  yellow: 'text-yellow-500',
  orange: 'text-orange-500',
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={cn('h-10 w-10', colorClasses[color])} />
        </div>
      </CardContent>
    </Card>
  );
}
