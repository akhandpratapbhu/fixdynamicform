import * as React from 'react';
import '../../styles/UI-Design/input.css';


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Textfield = React.forwardRef<HTMLInputElement, InputProps & { label?: string }>(
  ({ className, type = "text", label, placeholder, ...props }, ref) => {
    return (
      <form id="form-app">
        <fieldset className="row">
          <div className={className || "col-12"}>
            <div className="form-group">
              <label className="form-label" htmlFor="text_1">
                {label || "Text Field"}
              </label>
              <input
                ref={ref}
                type={type}
                id="text_1"
                placeholder={placeholder}
                className={`form-control ${className || ""}`}
                {...props}
              />
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
);


Textfield.displayName = 'Input';

export default Textfield;
