import * as React from 'react';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

export interface DnDraggableContext {
    rows: string[] | Array<{ id: string }>;
    onSort: (active: string, over: string) => void;
    children: React.ReactNode;
}

export function DnDraggableContext({ children, rows, onSort }: DnDraggableContext) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const ids = React.useMemo(() => {
        if (!rows || rows.length === 0) return [];
        return rows.map(row => {
            if (typeof row === 'object' && typeof row.id === 'string') {
                return row.id;
            } else if (typeof row === 'string') {
                return row;
            } else {
                throw new Error('DnDraggableContext rows property is malformed');
            }
        });
    }, [rows]);

    const handleDragEnd = React.useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            onSort(String(active.id), String(over.id));
        },
        [onSort]
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    );
}
