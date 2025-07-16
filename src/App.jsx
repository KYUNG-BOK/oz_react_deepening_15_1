// 드래그앤 드롭으로 할일->진행중->완료 옮기는건 했는데.. 
// 순서변경은.. 결국 실패했습니다...... 꼭 구현하겠습니다.. ㅠㅠ

import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import useBoardStore from './store';
import Boards from './components/Boards';
import Controller from './components/Controller';

function App() {
  const { data, updateBoardType, reorderItems } = useBoardStore();

  const [activeId, setActiveId] = useState(null);
  const activeItem = data.find((item) => item.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

const handleDragEnd = (event) => {
  const { active, over } = event;
  setActiveId(null);

  if (!over) return; // 드랍 위치 없으면 종료

  if (active.id === over.id) return; // 같은 위치면 종료

  const activeItem = data.find(item => item.id === active.id);
  if (!activeItem) return;

  const boardTypes = ['todo', 'inprogress', 'done'];

  if (boardTypes.includes(over.id)) {
    if (activeItem.type !== over.id) {
      updateBoardType(active.id, over.id);
    }
    return;
  }

  const sameTypeItems = data
    .filter(item => item.type === activeItem.type)
    .sort((a, b) => a.order - b.order);

  const oldIndex = sameTypeItems.findIndex(item => item.id === active.id);
  const newIndex = sameTypeItems.findIndex(item => item.id === over.id);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

  const newSameTypeItems = arrayMove(sameTypeItems, oldIndex, newIndex);

  const reorderedSameTypeItems = newSameTypeItems.map((item, index) => ({
    ...item,
    order: index,
  }));

  const otherItems = data.filter(item => item.type !== activeItem.type);

  const otherItemsReordered = Object.values(
    otherItems.reduce((acc, item) => {
      acc[item.type] = acc[item.type] || [];
      acc[item.type].push(item);
      return acc;
    }, {})
  ).flatMap(items =>
    items
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ ...item, order: index }))
  );

  // 합치기 & 정렬
  const newData = [...otherItemsReordered, ...reorderedSameTypeItems];
  newData.sort((a, b) => {
    const orderType = { todo: 0, inprogress: 1, done: 2 };
    if (orderType[a.type] !== orderType[b.type]) {
      return orderType[a.type] - orderType[b.type];
    }
    return a.order - b.order;
  });

  reorderItems(newData);
};




return (
  <DndContext
    sensors={sensors}
    collisionDetection={rectIntersection}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  >
    <div className="flex flex-col h-screen">
      <header className="w-full h-20 bg-slate-800 flex flex-col items-center justify-center text-stone-100">
        <p className="text-lg font-semibold">Kanban Board Project</p>
        <p>Chapter 2. Zustand + DnD</p>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 h-full">
          <Boards type="todo" />
          <Boards type="inprogress" />
          <Boards type="done" />
        </div>
      </main>

      <div className="p-4 bg-gray-100 border-t border-gray-300">
        <Controller />
      </div>

      <footer className="w-full h-15 bg-slate-800 flex items-center justify-center text-stone-100">
        <p>&copy; OZ-CodingSchool</p>
      </footer>
    </div>

    <DragOverlay>
      {activeItem && (
        <div className="bg-white shadow-xl rounded-md p-4 w-full max-w-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{activeItem.title}</h3>
            {activeItem.type === 'todo' && (
              <div className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
            )}
            {activeItem.type === 'inprogress' && (
              <div className="animate-pulse w-2 h-2 rounded-full bg-amber-500" />
            )}
            {activeItem.type === 'done' && (
              <div className="animate-pulse w-2 h-2 rounded-full bg-red-500" />
            )}
          </div>
          <p className="text-sm text-gray-500">{activeItem.created_at}</p>
        </div>
      )}
    </DragOverlay>
  </DndContext>
);
}

export default App;
