//1. useBoardStore를 선언하여 zustand 스토어를 불러옵니다.
//2. updateBoard 함수를 불러와 보드를 업데이트 합니다.

import React from 'react';
import useBoardStore from '../store'; // zustand 스토어 import

const BoardEditModal = ({ item, onClose }) => {
  const updateBoard = useBoardStore((state) => state.updateBoard); // zustand의 update 메서드 불러오기

  const handleForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editTask = {
      id: item.id, // 원래 항목 유지
      type: formData.get('type'),
      title: formData.get('title'),
      desc: formData.get('desc'),
      created_at: new Date().toISOString().split('T')[0],
    };

    updateBoard(editTask); // zustand 전역 상태 수정
    onClose(); // 모달 닫기
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg p-6 w-[600px]"
      >
        <h2 className="text-xl font-semibold mb-4 whitespace-break-spaces">업무 수정</h2>
        <form onSubmit={handleForm} className="flex flex-col gap-2">
          <div>업무 분류</div>
          <select
            className="border border-gray-300 rounded-md p-2"
            name="type"
            id="type"
            defaultValue={item.type}
          >
            <option value="todo">할 일</option>
            <option value="inprogress">진행 중</option>
            <option value="done">완료</option>
          </select>
          <div>업무 제목</div>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="업무 제목을 입력하세요."
            className="border border-gray-300 rounded-md p-2"
            defaultValue={item.title}
            required
          />
          <div>업무 내용</div>
          <textarea
            name="desc"
            id="desc"
            placeholder="업무 내용을 입력하세요."
            className="border border-gray-300 rounded-md p-2 resize-none"
            defaultValue={item.desc}
            required
          ></textarea>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="cursor-pointer mt-4 bg-black text-white px-4 py-2 rounded hover:bg-stone-600"
            >
              수정
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardEditModal;
