import { GripVerticalIcon, Trash2Icon } from 'lucide-react';
import {
  type AnimateLayoutChanges,
  useSortable,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { Checkbox } from '../ui/Checkbox';
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
import Textfield from '../ui/textfield';

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
import { useState } from 'react';
import Modal from '@mui/material/Modal/Modal';
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setFormData } from "../../redux/formSlice";

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
  const dispatch = useDispatch();

  const { id, label, DataType, inputField, isRequired, options } = formElement;
  const removeFormElement = useFormPlaygroundStore(
    state => state.removeFormElement,
  );
  const toggleRequired = useFormPlaygroundStore(state => state.toggleRequired);
  const updateLabel = useFormPlaygroundStore(state => state.updateLabel);
  const updateName = useFormPlaygroundStore(state => state.updateName);
  const updatePlaceholder = useFormPlaygroundStore(state => state.updatePlaceholder);
  const updateMinlength = useFormPlaygroundStore(state => state.updateMinlength);
  const updateMaxlength = useFormPlaygroundStore(state => state.updateMaxlength);
  const updateClassName = useFormPlaygroundStore(state => state.updateClassName);
  const updateValue = useFormPlaygroundStore(state => state.updateValue);

  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = React.useState(formElement);

  const handleSave = () => {
    setData(formElement)
    // dispatch(setFormData(formElement)); // Send data to Redux store
    handleClose(); // Close the modal
  };

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
  console.log("formElement", formElement.label);

  return (
    <article
      className={`form-element-card ${isDragging ? 'dragging' : ''} ${isView ? 'view-mode' : 'edit-mode'
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

            {/* <BubbleMenuEditor
              placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
              content={label}
              updateHandler={(html: string) => updateLabel(id, html)}
              readOnly={isView}
            /> */}
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
            </div>
          )}
        </div>
        (<input type="button" style={{ width: "100px" }} onClick={handleClickOpen} />)
        {/* Field Type Rendering */}
        {/* {DataType === 'single-line' ? (
          <Input
            type="string"
            placeholder="Single line text"
            required={field ? isRequired : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) */}
        {DataType === 'single-line' ? (
          <Textfield 
          value={formElement?.inputField.value || ""} 
          placeholder={formElement?.inputField.placeholder || "Enter text"} 
          label={formElement?.label || "Text Field"} 
          className={formElement?.inputField.className || ""}
        />
        ) : DataType === 'number' ? (
          <Textfield
            type="button"
            placeholder="Number"
            required={field ? isRequired : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : DataType === 'multi-line' ? (
          <Textarea
            placeholder="Multi line text..."
            required={field ? isRequired : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : DataType === 'rich-text' ? (
          <RichTextEditor field={field} />
        ) : ['checklist', 'multi-choice', 'dropdown', 'combobox'].includes(
          DataType,
        ) && !isView ? (
          <Options type={DataType} id={id} />
        ) : DataType === 'checklist' ? (
          <ul className="space-y-3">
            {options?.map(({ label, value }) => (
              <li key={value} className="flex items-center gap-3">
                <Checkbox
                  id={value}
                  checked={field?.value?.includes(label) ?? false}
                  onCheckedChange={checked => {
                    if (checked) field?.onChange([...field.value, label]);
                    else
                      field?.onChange(
                        field.value.filter((val: string) => val !== label),
                      );
                  }}
                />
                <Label
                  htmlFor={value}
                  className="flex h-5 items-center font-normal"
                >
                  {label}
                </Label>
              </li>
            ))}
          </ul>
        ) : DataType === 'multi-choice' ? (
          <RadioGroup
            className="gap-3"
            value={field?.value}
            onValueChange={field?.onChange}
          >
            {options?.map(({ label, value }) => (
              <div key={value} className="flex items-center space-x-3">
                <RadioGroupItem value={value} id={value} />
                <Label
                  htmlFor={value}
                  className="flex h-5 items-center font-normal"
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : DataType === 'dropdown' ? (
          <Select
            value={field?.value}
            onValueChange={field?.onChange}
            required={field ? isRequired : false}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {options?.map(({ label, value }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : DataType === 'combobox' && options ? (
          <Combobox options={options} field={field} />
        ) : DataType === 'date' ? (
          <DatePicker field={field} />
        ) : DataType === 'date-range' ? (
          <DateRangePicker field={field} />
        ) : DataType === 'time' ? (
          <Textfield
            type="time"
            className="w-32"
            required={field ? isRequired : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : DataType === 'attachments' ? (
          <Textfield
            type="file"
            className="pt-1.5 text-muted-foreground"
            required={field ? isRequired : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : DataType === 'image' ? (
          <Textfield
            type="file"
            accept="image/*"
            className="pt-1.5 text-muted-foreground"
            required={field ? isRequired : false}
            value={field?.value ?? ''}
            onChange={field?.onChange}
          />
        ) : null}
        {isView && isRequired ? (
          <div className="pt-1 text-sm text-destructive">* Required</div>
        ) : null}

      </div>

      {/* Popup Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"text field"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="popup-content">
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content='label'
                updateHandler={(label: string) => updateLabel(id, label)}
                readOnly={isView}
              />
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content="name"
                updateHandler={(name: string) => updateName(id, name)}
                readOnly={isView}
              />
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content="Placeholder"
                updateHandler={(Placeholder: string) => updatePlaceholder(id, Placeholder)}
                readOnly={isView}
              />
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content='minlength'
                updateHandler={(minlength: string) => updateMinlength(id, minlength)}
                readOnly={isView}
              />
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content='maxlength'
                updateHandler={(maxlength: string) => updateMaxlength(id, maxlength)}
                readOnly={isView}
              />
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content='className'
                updateHandler={(className: string) => updateClassName(id, className)}
                readOnly={isView}
              />
              <BubbleMenuEditor
                placeholder={['heading', 'description'].includes(DataType) ? label : 'Question or Text'}
                content='value'
                updateHandler={(value: string) => updateValue(id, value)}
                readOnly={isView}
              />

              <div className="form-controls">
                {!['heading', 'description', 'switch', 'checkbox'].includes(DataType) && (
                  <div className="required-toggle">
                    <Switch id={'required-' + id} checked={isRequired} onCheckedChange={() => toggleRequired(id)} />
                    <Label className="required-label" htmlFor={'required-' + id}>
                      Required
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} autoFocus>
            save
          </Button>
          <Tooltip asChild title="Delete">
            <Button type="button" variant="ghost" size="icon" className="delete-button" onClick={() => removeFormElement(id)}>
              <Trash2Icon className="delete-icon" />
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>

    </article>
  );
}
