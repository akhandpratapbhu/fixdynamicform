import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';
import FormElementCard from './FormElementCard';
import { ScrollArea } from '../ui/ScrollArea';
import '../../styles/formPlayGround.css'; // Ensure you include the same CSS file

interface Props {
  columns: number; // Accept columns as a prop
}

export default function FormPreview({ columns }: Props) {
  const formElements = useFormPlaygroundStore(state => state.formElements);
console.log("col",columns);

  return (
    <section className="flex-grow rounded-lg border-2 border-dashed border-slate-300 bg-muted">
      {formElements.length === 0 ? (
        <p className="flex h-full items-center justify-center font-medium text-muted-foreground">
          Add some form elements in the builder view
        </p>
      ) : (
        <ScrollArea className="h-[calc(100vh-212px)]">
          <ul className={`form-elements-container grid-${columns} p-5`}>
            {formElements.map(element => (
              <li key={element.id}>
                <FormElementCard formElement={element} isView />
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </section>
  );
}
