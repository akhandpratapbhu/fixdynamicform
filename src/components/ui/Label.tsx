import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import '../../styles/UI-Design/label.css';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={`custom-label ${className || ''}`}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
