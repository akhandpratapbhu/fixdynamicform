import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { FormElementsType } from '../components/form-validation-type';

interface FormPlaygroundStoreType {
  formElements: FormElementsType[];
  setFormElements: (formElements: FormElementsType[]) => void;
  addFormElement: (label: string, DataType: string) => void;
  moveFormElement: (oldIndex: number, newIndex: number) => void;
  updateLabel: (id: string, label: string) => void;
  updateName: (id: string, name: string) => void;
  updatePlaceholder: (id: string, updatePlaceholder: string) => void;
  updateMinlength: (id: string, updateMinlength: string) => void;  
  updateMaxlength: (id: string, updateMaxlength: string) => void;
  updateClassName: (id: string, updateClassName: string) => void;
  updateValue: (id: string, updateValue: string) => void;

  toggleRequired: (id: string) => void;
  addOption: (id: string) => void;
  updateOption: (id: string, optionId: string, label: string) => void;
  deleteOption: (id: string, optionId: string) => void;
  removeFormElement: (id: string) => void;
  removeAllFormElements: () => void;
}

export const useFormPlaygroundStore = createWithEqualityFn(
  immer<FormPlaygroundStoreType>((set: (arg0: any) => any) => ({
    formElements: [],
    setFormElements: (formElements: FormElementsType[]) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = formElements;
        },
        console.log(formElements)
      ),
        
      ),
      
    addFormElement: (label: any, DataType: string) =>
      
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.push({
            id: uuid(),
            label,
            DataType,
            isRequired: false,
            options: [
              'checklist',
              'multi-choice',
              'dropdown',
              'combobox',
            ].includes(DataType)
              ? [
                { label: 'Option 1', value: uuid() },
                { label: 'Option 2', value: uuid() },
              ]
              : undefined,
              inputField: {
              label: '',
              name: '',
              placeholder: '',
              minlength: '',
              maxlength: '',
              className: '',
              value: ''
            }
          });
          console.log("addformelemw",label, DataType,name)

        }
      ),

      ),
    moveFormElement: (oldIndex: number, newIndex: number) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = arrayMove(
            draft.formElements,
            oldIndex,
            newIndex,
          );
        }),
      ),
      updateLabel: (id: any, label: string) =>
        set(
          produce((draft: FormPlaygroundStoreType) => {
            draft.formElements.forEach(el => {
              if (el.id === id) {
                el.label = label.replace(/<[^>]*>/g, ""); // Removes HTML tags
                return;
              }
            });
            console.log("updateLabel", label);
          }),
        ),
        updateName: (id: any, name: string) =>
          set(
            produce((draft: FormPlaygroundStoreType) => {
              draft.formElements.forEach(el => {
                if (el.id === id) {
                  el.inputField.name = name.replace(/<[^>]*>/g, ""); // Removes HTML tags
                  return;
                }
              });
              console.log("updateNameinplaygroundstore",name);
            }),
          ),
          updatePlaceholder: (id, placeholder) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(el => {
            if (el.id === id) {
              el.inputField.placeholder = placeholder.replace(/<[^>]*>/g, ""); // Removes HTML tags;
              return;
            }
          });
          console.log("updateplaceholder",placeholder,)

        }),
      ),
      updateMinlength: (id, minlength) =>
        set(
          produce((draft: FormPlaygroundStoreType) => {
            draft.formElements.forEach(el => {
              if (el.id === id) {
                el.inputField.minlength = minlength.replace(/<[^>]*>/g, ""); // Removes HTML tags;
                return;
              }
            });
            console.log("updateminlength",minlength)
  
          }),
        ),
        updateMaxlength: (id, maxlength) =>
          set(
            produce((draft: FormPlaygroundStoreType) => {
              draft.formElements.forEach(el => {
                if (el.id === id) {
                  el.inputField.maxlength = maxlength.replace(/<[^>]*>/g, ""); // Removes HTML tags;
                  return;
                }
              });
              console.log("updatemaxlength",maxlength,)
    
            }),
          ),
          updateClassName: (id, className) =>
            set(
              produce((draft: FormPlaygroundStoreType) => {
                draft.formElements.forEach(el => {
                  if (el.id === id) {
                    el.inputField.className = className.replace(/<[^>]*>/g, ""); // Removes HTML tags;
                    return;
                  }
                });
                console.log("updateclassname",className,)
      
              }),
            ),
            updateValue: (id, value) =>
              set(
                produce((draft: FormPlaygroundStoreType) => {
                  draft.formElements.forEach(el => {
                    if (el.id === id) {
                      el.inputField.value= value.replace(/<[^>]*>/g, ""); // Removes HTML tags;
                      return;
                    }
                  });
                  console.log("updatevalue",value,)
        
                }),
              ),
    toggleRequired: (id: any) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(el => {
            if (el.id === id) {
              el.isRequired = !el.isRequired;
              return;
            }
          });
        }),
      ),
    addOption: (id: any) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(el => {
            if (el.id === id) {
              el.options?.push({
                label: 'Option ' + (el.options.length + 1),
                value: uuid(),
              });
              return;
            }
          });
        }),
      ),
    updateOption: (id: any, optionId: any, label: any) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formEl = draft.formElements.find(el => el.id === id);
          formEl?.options?.forEach((option: { value: any; label: any; }) => {
            if (option.value === optionId) {
              option.label = label;
              return;
            }
          });
        }),
      ),
    deleteOption: (id: any, optionId: any) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formEl = draft.formElements.find(el => el.id === id);
          if (formEl?.options)
            formEl.options = formEl.options.filter(
                (              option: { value: any; }) => option.value !== optionId,
            );
        }),
      ),
    removeFormElement: (id: any) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = draft.formElements.filter(el => el.id !== id);
        }),
      ),
    removeAllFormElements: () =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = [];
        }),
      ),
  })),
  Object.is,
);
