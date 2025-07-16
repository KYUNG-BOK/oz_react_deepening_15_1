import React from 'react';
import { useSetRecoilState } from 'recoil';
import { kanbanState } from '../recoil/atom';

const ControllerDetailModal = ({ onClose }) => {
  const setKanbanState = useSetRecoilState(kanbanState);
  // recoil을 이용하여 상태관리를 하도록 변경합니다.
  // useSetRecoilState를 이용하여 전역상태를 업데이트하도록 수정합니다.
  // handleForm에서 data를 만들고 있습니다. 이 data를 할당해야합니다.


  const handleForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newItem = {
      id: Date.now(),
      type: formData.get('type'),
      title: formData.get('title'),
      desc: formData.get('desc'),
      created_at: new Date().toISOString().split('T')[0],
    };

    // 상태 업데이트: 기존 목록에 새 항목 추가
    setKanbanState((prev) => [...prev, newItem]);

    onClose(); // 모달 닫기
  };

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
        <h2 className="text-xl font-semibold mb-4 whitespace-break-spaces">업무 추가</h2>
        <form onSubmit={handleForm} className="flex flex-col gap-2">
          <div>업무 분류</div>
          <select className="border border-gray-300 rounded-md p-2" name="type" id="type">
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
            required
          />
          <div>업무 내용</div>
          <textarea
            name="desc"
            id="desc"
            placeholder="업무 내용을 입력하세요."
            className="border border-gray-300 rounded-md p-2 resize-none"
            required
          ></textarea>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="cursor-pointer mt-4 bg-black text-white px-4 py-2 rounded hover:bg-stone-600"
            >
              추가
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

export default ControllerDetailModal;
