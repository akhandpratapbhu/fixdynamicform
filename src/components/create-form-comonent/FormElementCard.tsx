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

  const { id, label, DataType, isRequired, options } = formElement;
  const removeFormElement = useFormPlaygroundStore(
    state => state.removeFormElement,
  );
  const toggleRequired = useFormPlaygroundStore(state => state.toggleRequired);
  const updateLabel = useFormPlaygroundStore(state => state.updateLabel);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormDataState] = useState({
    label: '',
    placeholder: '',
    name: '',
    minlength: '',
    maxlength: '',
    column: '',
    value:''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormDataState({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; 
  const handleSave = () => {
   // setFormData({ ...formData});
    dispatch(setFormData(formData)); // Send data to Redux store
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
         {/* Field Type Rendering */}
        {DataType === 'single-line' ? <Textfield type= "button" onClick={handleClickOpen}   /> : null}

  

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
          <p>input-type</p>
          <input
        type="text"
        name="text"
        placeholder="label line text"
        value="text"

      />
          <p>Label</p>
          <input
        type="text"
        name="label"
        placeholder="label line text"
        value={formData.label}
        onChange={handleChange}

      />
      <p>name</p>
          <input
        type="text"
        name="name"
        placeholder="enter name of input field"
        value={formData.name}
        onChange={handleChange}
        required

      />
      <p>Placeholder</p>
      <input
        type="text"
        name="placeholder"
        placeholder="enter placeholder name"
        value={formData.placeholder}
        onChange={handleChange}
      />
 <p>Min-Length</p>
       <input
        type="number"
        name="minlength"
        placeholder="enter min length"
        value={formData.minlength}
        onChange={handleChange}
      />
           <p>Max-Length</p>

      <input
        type="number"
        name="maxlength"
        placeholder="enter max length"
        value={formData.maxlength}
        onChange={handleChange}
      />
            <p>Container CSS Class</p>

      <input
        type="text"
        name="column"
        placeholder="enter column like- col-12"
        value={formData.column}
        onChange={handleChange}
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
