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
import { useEffect, useRef, useState } from 'react';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';

import '../../styles/formPlayGround.css'; // Import external CSS
import FormPreview from './FormPreview';

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
  useEffect(() => {
    console.log("formelemnt", formElements)
  })

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
              {/* Render Default Form Elements */}
              {formElements
                .filter(element => element.DataType !== 'column')
                .map(element => (
                  <FormElementCard key={element.id} formElement={element} />
                ))}

              {/* Flex Container for Columns */}
              <div className="column-container">
                {formElements
                  .filter((element) => element.DataType === "column") // ✅ Type assertion
                  .map((column) => (
                    <div key={column.id} className="column-wrapper">
                      <p className="column-title">Column {column.id}</p>

                      {/* Left Column Drop Zone */}
                      <SortableContext items={column.leftItems} strategy={verticalListSortingStrategy}>
                        <section ref={setNodeRef} className="column-dropzone left-zone">
                          <p className="drop-message">Left Column</p>
                          {column.leftItems.length > 0 ? (
                            column.leftItems.map((item) => <FormElementCard key={item} formElement={item} />)
                          ) : (
                            <p className="empty-column">Drop items here</p>
                          )}
                        </section>
                      </SortableContext>

                      {/* Right Column Drop Zone */}
                      <SortableContext items={column.rightItems} strategy={verticalListSortingStrategy}>
                        <section ref={setNodeRef} className="column-dropzone right-zone">
                          <p className="drop-message">Right Column</p>
                          {column.rightItems.length > 0 ? (
                            column.rightItems.map((item) => <FormElementCard key={item} formElement={item} />)
                          ) : (
                            <p className="empty-column">Drop items here</p>
                          )}
                        </section>
                      </SortableContext>
                    </div>
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
