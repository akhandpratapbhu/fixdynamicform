import * as React from 'react';
import '../../styles/UI-Design/input.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Textfield = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
  const formData = useSelector((state: RootState) => state.form);
  console.log(formData);

  return (
    <form id="form-app">
      <fieldset className="row">
        <div className={formData.column || "col-12"}>
          <div className="form-group">
            <label className="form-label" htmlFor="text_1">
              {formData.label || "Text Field"}
            </label>
            <input
              ref={ref}
              type="text"
              id="text_1"
              name={formData.name || "text_1"}
              placeholder={formData.placeholder || "Enter text"}
              className={`form-control ${className || ""}`}
              max={formData.maxlength || undefined}
              min={formData.minlength || undefined}
              defaultValue={formData.value || ""} // ✅ Use `defaultValue` to avoid read-only errors
              {...props} // ✅ Spread remaining props
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
});

Textfield.displayName = 'Input';

export default Textfield;
