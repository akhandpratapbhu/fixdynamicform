import { GripVerticalIcon, Trash2Icon } from 'lucide-react';
import {
  type AnimateLayoutChanges,
  useSortable,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { Checkbox } from '../ui/Checkbox';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { Switch } from '../ui/Switch';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Textarea } from '../ui/Textarea';
import RichTextEditor from '../shared/RichTextEditor';
import BubbleMenuEditor from '../shared/BubbleMenuEditor';
import { DatePicker } from '../shared/DatePicker';
import { DateRangePicker } from '../shared/DateRangePicker';
import Options from './Options';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Combobox } from '../ui/Combobox';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { FormElementsType } from '../form-validation-type';
import '../../styles/formElementCard.css'; // Import external CSS file

const animateLayoutChanges: AnimateLayoutChanges = args => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
};

interface Props {
  formElement: FormElementsType;
  isView?: boolean;
  field?: ControllerRenderProps<FieldValues, string>;
}

export default function FormElementCard({
  formElement,
  isView = false,
  field,
}: Props) {
  const { id, label, DataType, isRequired, options } = formElement;
  const removeFormElement = useFormPlaygroundStore(
    state => state.removeFormElement,
  );
  const toggleRequired = useFormPlaygroundStore(state => state.toggleRequired);
  const updateLabel = useFormPlaygroundStore(state => state.updateLabel);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

  const cardStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <article
      className={`form-element-card ${isDragging ? 'dragging' : ''} ${
        isView ? 'view-mode' : 'edit-mode'
      }`}
      ref={setNodeRef}
      style={cardStyle}
    >
      {!isView && (
        <div className="drag-handle" {...listeners} {...attributes}>
          <GripVerticalIcon className="drag-icon" />
        </div>
      )}

      <div className="form-content">
        <div className="form-header">
          <div className="form-label">
            {DataType === 'switch' ? (
              <Switch checked={field?.value} onCheckedChange={field?.onChange} />
            ) : DataType === 'checkbox' ? (
              <Checkbox checked={field?.value} onCheckedChange={field?.onChange} />
            ) : null}

            <BubbleMenuEditor
              placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
              content={label}
              updateHandler={(html: string) => updateLabel(id, html)}
              readOnly={isView}
            />
          </div>

          {!isView && (
            <div className="form-controls">
              {!['heading', 'description', 'switch', 'checkbox'].includes(DataType) && (
                <div className="required-toggle">
                  <Switch id={'required-' + id} checked={isRequired} onCheckedChange={() => toggleRequired(id)} />
                  <Label className="required-label" htmlFor={'required-' + id}>
                    Required
                  </Label>
                </div>
              )}

              <Separator className="separator" />
              <Tooltip asChild title="Delete">
                <Button type="button" variant="ghost" size="icon" className="delete-button" onClick={() => removeFormElement(id)}>
                  <Trash2Icon className="delete-icon" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Field Type Rendering */}
        {DataType === 'single-line' ? (
          <Input type="text" placeholder="Single line text" required={isRequired} value={field?.value ?? ''} onChange={field?.onChange} />
        ) : DataType === 'number' ? (
          <Input type="number" placeholder="Number" required={isRequired} value={field?.value ?? ''} onChange={field?.onChange} />
        ) : DataType === 'multi-line' ? (
          <Textarea placeholder="Multi line text..." required={isRequired} value={field?.value ?? ''} onChange={field?.onChange} />
        ) : DataType === 'rich-text' ? (
          <RichTextEditor field={field} />
        ) : ['checklist', 'multi-choice', 'dropdown', 'combobox'].includes(DataType) && !isView ? (
          <Options type={DataType} id={id} />
        ) : DataType === 'date' ? (
          <DatePicker field={field} />
        ) : DataType === 'date-range' ? (
          <DateRangePicker field={field} />
        ) : DataType === 'time' ? (
          <Input type="time" required={isRequired} value={field?.value ?? ''} onChange={field?.onChange} />
        ) : DataType === 'attachments' ? (
          <Input type="file" required={isRequired} value={field?.value ?? ''} onChange={field?.onChange} />
        ) : DataType === 'image' ? (
          <Input type="file" accept="image/*" required={isRequired} value={field?.value ?? ''} onChange={field?.onChange} />
        ) : null}

        {isView && isRequired && <div className="required-message">* Required</div>}
      </div>
    </article>
  );
}
