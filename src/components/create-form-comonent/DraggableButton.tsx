import type { LucideIcon } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { JSX } from 'react';

export interface FormElementButtonProps {
  text: string;
  Icon: LucideIcon |  ((props: { className: string }) => JSX.Element) ;
}

const buttonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: '#f5f5f5',
  cursor: 'grab',
  transition: 'box-shadow 0.2s ease-in-out',
};

const iconStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const textStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '18px',
  flexGrow: 1,
};

export const FormElementButton = ({ text, Icon }: FormElementButtonProps) => (
  <button style={buttonStyle}>
    <span style={iconStyle}>
      <Icon style={{ width: '100%', height: '100%' }} className={''} />
    </span>
    <span style={textStyle}>{text}</span>
  </button>
);

export default function DraggableButton(props: FormElementButtonProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.text.toLowerCase().replace(' ', '-'),
    data: { element: props },
  });

  return (
    <li
      style={{
        opacity: isDragging ? 0.5 : 1,
        listStyle: 'none',
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <FormElementButton {...props} />
    </li>
  );
}
