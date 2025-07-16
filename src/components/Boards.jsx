import React, { useState } from 'react';
import BoardDetailModal from './BoardDetailModal';
import BoardConfirmModal from './BoardConfirmModal';
import BoardEditModal from './BoardEditModal'; // 수정 모달 import
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

const Boards = ({ type }) => {
  const data = useBoardStore((state) => state.data);
  const removeBoard = useBoardStore((state) => state.removeBoard);

  const filteredData = data.filter((item) => item.type === type);

  const [detailItem, setDetailItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false); // 수정 모달 상태

  const openDetail = (item) => {
    setDetailItem(item);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailItem(null);
    setIsDetailOpen(false);
  };

  // 상세 모달 내 삭제 버튼 클릭 시
  const openConfirm = (id) => {
    setTargetId(id);
    setIsConfirmOpen(true);
    setIsDetailOpen(false); // 상세 모달 닫기
  };

  const closeConfirm = () => {
    setTargetId(null);
    setIsConfirmOpen(false);
  };

  const handleDelete = () => {
    removeBoard(targetId);
    closeConfirm();
  };

  // 수정 모달 열기
  const handleEditModalOpen = () => {
    setIsEditOpen(true);
    setIsDetailOpen(false); // 상세 모달 닫기
  };

  // 수정 모달 닫기
  const handleEditModalClose = () => {
    setIsEditOpen(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[60px] bg-stone-200 rounded-sm flex items-center justify-center">
        <p className="text-lg font-semibold">{typeToKorean(type)}</p>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            onClick={() => openDetail(item)}
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
        <BoardEditModal
          item={detailItem}
          onClose={handleEditModalClose}
        />
      )}
    </div>
  );
};

export default Boards;
