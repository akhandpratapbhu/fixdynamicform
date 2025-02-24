import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { KeyboardSensor, PointerSensor } from '../lib/dndKitSensors';
import FormElements from '../components/create-form-comonent/FormElements';
import {
  FormElementButton,
  FormElementButtonProps,
} from '../components/create-form-comonent/DraggableButton';
import { useEffect, useState } from 'react';
import FormPlayground from '../components/create-form-comonent/FormPlayground';
import Input from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EyeIcon, HammerIcon, LockIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/AlertDialog';
import { useFormPlaygroundStore } from '../stores/formPlaygroundStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DemoInfoCard from '../components/create-form-comonent/DemoInfoCard';
import type { FormType } from '../components/formType';
import { Switch } from '../components/ui/Switch';
import FormPreview from '../components/create-form-comonent/FormPreview';
import axios from 'axios';
import "../styles/create-form.css"

interface Props {
  formType?: 'add' | 'edit';
  form?: FormType;
}

export default function CreateForm({ formType = 'add', form }: Props) {
  const { id } = useParams();
  const [isPreview, setIsPreview] = useState(false);

  const [formName, setFormName] = useState(form?.name ?? '');
  const [activeButton, setActiveButton] =
    useState<FormElementButtonProps | null>(null);
  const [isDropped, setIsDropped] = useState(false);

  const addFormElement = useFormPlaygroundStore((state: { addFormElement: any; }) => state.addFormElement);
  const removeAllFormElements = useFormPlaygroundStore(
    (state: { removeAllFormElements: any; }) => state.removeAllFormElements,
  );
  const formElements = useFormPlaygroundStore((state: { formElements: any; }) => state.formElements);
  console.log(formElements)
  useEffect(() => {
    return () => {
      if (formType === 'edit') removeAllFormElements();
    };
  }, [removeAllFormElements, formType]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const apiCall = async () => {
    try {
      await axios({
        url:
          formType === 'add'
            ? `http://localhost:8011/api/Home/InsertUpdateEntity`
            : `${import.meta.env.VITE_BACKEND_BASE_URL}/forms/${id}`,
        method: formType === 'add' ? 'post' : 'patch',
        data: {
          name: formName,
          attributes: formElements,
        },
      });

      toast.success(`Form ${formType === 'add' ? 'created' : 'updated'} successfully`);
    } catch (error) {
      toast.error(`Error ${formType === 'add' ? 'creating' : 'updating'} form`);
      console.error('API Error:', error);
    }
  };



  return (

    <DndContext
      sensors={sensors}
      onDragStart={(e) => {
        setActiveButton(e.active.data.current?.element);
        setIsDropped(false);
      }}
      onDragCancel={() => {
        setActiveButton(null);
        setIsDropped(false);
      }}
      onDragEnd={({ over, active }) => {
        setActiveButton(null);
        if (!over) return;
        addFormElement(active.data.current?.element.text as string, active.id as string);
        setIsDropped(true);
      }}
    >
      <div className="container">
        <div className="row">
          {/* Form Elements (4 Columns) */}
          <div className="col-md-4">
            <FormElements isUpdate={formType === "edit"} />
          </div>
    
          {/* Form Section (8 Columns) */}
          <div className="col-md-8 form-container">
            <form
              className="form-layout"
              onSubmit={(e) => {
                e.preventDefault();
                if (formElements.length === 0) {
                  toast.error("Form is empty!");
                  return;
                }
                apiCall();
              }}
            >
              {/* Form Header */}
              <section className="form-header">
                <div className="form-name">
                  <label>Form Name:</label>
                  <Input required placeholder="Enter form name" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="form-toggle">
                  <div className={`toggle-item ${isPreview ? "" : "text-primary"}`}>
                    <span>Builder</span>
                  </div>
                  <Switch checked={isPreview} onCheckedChange={setIsPreview} />
                  <div className={`toggle-item ${isPreview ? "text-primary" : ""}`}>
                    <EyeIcon className="icon" />
                    <span>Preview</span>
                  </div>
                </div>
              </section>
    
              {/* Form Body */}
              {isPreview ? <FormPreview columns={0} /> : <FormPlayground isDropped={isDropped} resetIsDropped={() => setIsDropped(false)} isUpdate={formType === "edit"} />}
    
              {/* Form Footer */}
              <section className="form-footer">
                {form && <button className="btn btn-outline-secondary">Cancel</button>}
    
                {formElements.length !== 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="btn btn-danger">Clear Form</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear Form?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to clear the form? This action is irreversible.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction onClick={removeAllFormElements}>Yes, clear form</AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
    
                <button className="btn btn-primary">{form ? "Update Form" : "Save Form"}</button>
              </section>
            </form>
          </div>
        </div>
      </div>
    
      <DragOverlay modifiers={[restrictToWindowEdges]}>{activeButton ? <FormElementButton {...activeButton} /> : null}</DragOverlay>
    </DndContext>
    
  );
}
