import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export const ReportBadge = ({ level = 'Medium', size = 'md', className = '' }) => {
  const normalizedLevel = ['Low', 'Medium', 'High', 'Critical'].includes(level) ? level : 'Medium';

  const styles = {
    Low: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      label: 'Low Risk'
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      label: 'Moderate Threat'
    },
    High: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
      icon: ShieldAlert,
      iconColor: 'text-orange-600 dark:text-orange-400',
      label: 'High Threat'
    },
    Critical: {
      bg: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 animate-pulse',
      icon: AlertOctagon,
      iconColor: 'text-red-600 dark:text-red-400',
      label: 'Critical Danger'
    }
  };

  const current = styles[normalizedLevel];
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3.5 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm ${current.bg} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <IconComponent className={`w-4 h-4 ${current.iconColor}`} />
      <span>{current.label}</span>
    </span>
  );
};
