import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import '../../styles/UI-Design/switch.css'; // Import external CSS

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root className={`switch-root ${className}`} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className="switch-thumb" />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
