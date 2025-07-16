import React, { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import BoardDetailModal from './BoardDetailModal';
import BoardConfirmModal from './BoardConfirmModal';
import BoardEditModal from './BoardEditModal';
import useBoardStore from '../store';

const typeToKorean = (type) => {
  switch (type) {
    case 'todo':
      return '할 일';
    case 'inprogress':
      return '진행 중';
    case 'done':
      return '완료';
    default:
      return type;
  }
};

// Card 컴포넌트 수정: 드래그 가능한 아이템 정의 + id, type 포함
const Card = ({ item, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      type: item.type,
      item,
    },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(item)}
      className="bg-white hover:bg-stone-100 shadow-md rounded-md p-4 cursor-pointer flex items-center justify-between"
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        {item.type === 'todo' && (
          <div className="animate-pulse w-2 h-2 rounded-full bg-green-500"></div>
        )}
        {item.type === 'inprogress' && (
          <div className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></div>
        )}
        {item.type === 'done' && (
          <div className="animate-pulse w-2 h-2 rounded-full bg-red-500"></div>
        )}
      </div>
    </div>
  );
};

const Boards = ({ type }) => {
  const data = useBoardStore((state) => state.data);
  const removeBoard = useBoardStore((state) => state.removeBoard);

  // 해당 타입만 필터 + order 순 정렬
  const filteredData = data
    .filter((item) => item.type === type)
    .sort((a, b) => a.order - b.order);

  // 드롭 가능 영역 설정
  const { setNodeRef, isOver } = useDroppable({
    id: type,
    data: { type },
  });

  const [detailItem, setDetailItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openDetail = (item) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailItem(null);
    setIsDetailOpen(false);
  };
  const openConfirm = (id) => {
    setTargetId(id);
    setIsConfirmOpen(true);
    setIsDetailOpen(false);
  };
  const closeConfirm = () => {
    setTargetId(null);
    setIsConfirmOpen(false);
  };
  const handleDelete = () => {
    removeBoard(targetId);
    closeConfirm();
  };
  const handleEditModalOpen = () => {
    setIsEditOpen(true);
    setIsDetailOpen(false);
  };
  const handleEditModalClose = () => {
    setIsEditOpen(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[60px] bg-stone-200 rounded-sm flex items-center justify-center">
        <p className="text-lg font-semibold">{typeToKorean(type)}</p>
      </div>

      {/* 드롭 영역 */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-4 min-h-[300px] transition-colors duration-200 rounded-md ${
          isOver ? 'bg-blue-50' : 'bg-stone-100'
        }`}
      >
        {filteredData.map((item) => (
          <Card key={item.id} item={item} onClick={openDetail} />
        ))}
      </div>

      {isDetailOpen && (
        <BoardDetailModal
          item={detailItem}
          onClose={closeDetail}
          onDelete={() => openConfirm(detailItem.id)}
          onEdit={handleEditModalOpen}
        />
      )}

      {isConfirmOpen && (
        <BoardConfirmModal
          id={targetId}
          onClose={closeConfirm}
          onDelete={handleDelete}
        />
      )}

      {isEditOpen && (
        <BoardEditModal item={detailItem} onClose={handleEditModalClose} />
      )}
    </div>
  );
};

export default Boards;
