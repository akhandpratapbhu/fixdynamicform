import {
  DndContext,
  type DragEndEvent,
  useDroppable,
  useSensor,
  useSensors,
  MeasuringStrategy,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';

import FormElementCard from './FormElementCard';
import { KeyboardSensor, PointerSensor } from '../../lib/dndKitSensors';
import { ScrollArea } from '../ui/ScrollArea';
import { useRef } from 'react';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';

import '../../styles/formPlayGround.css'; // Import external CSS

interface Props {
  isDropped: boolean;
  resetIsDropped: () => void;
  isUpdate?: boolean;
}

export default function FormPlayground({
  isDropped,
  resetIsDropped,
  isUpdate = false,
}: Props) {
  const formElements = useFormPlaygroundStore(state => state.formElements);
  const moveFormElement = useFormPlaygroundStore(state => state.moveFormElement);

  const { setNodeRef, isOver } = useDroppable({ id: 'droppable' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const cardsEndRef = useRef<HTMLDivElement>(null);
  if (cardsEndRef.current && isDropped) {
    cardsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => resetIsDropped(), 500);
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      onDragEnd={handleDragEnd}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      collisionDetection={closestCenter}
    >
      <SortableContext items={formElements} strategy={verticalListSortingStrategy}>
        <section ref={setNodeRef} className={`dropzone ${isOver ? 'dropzone-active' : ''}`}>
          {formElements.length === 0 ? (
            <p className={`drop-message ${isOver ? 'drop-message-active' : ''}`}>
              {isOver ? 'Drop the element here ...' : 'Drag an element from the right to this area'}
            </p>
          ) : (
            <ScrollArea className={isUpdate ? 'scroll-area-update' : 'scroll-area'}>
              <div className="form-elements-container">
                {formElements.map(element => (
                  <FormElementCard key={element.id} formElement={element} />
                ))}
              </div>
              <div ref={cardsEndRef} />
            </ScrollArea>
          )}
        </section>
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = active.data.current?.sortable.index as number;
      const newIndex = over.data.current?.sortable.index as number;
      moveFormElement(oldIndex, newIndex);
    }
  }
}
