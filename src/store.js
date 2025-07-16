//1. useBoardStore를 선언하여 zustand 스토어를 생성합니다.
//2. persist 미들웨어를 사용하여 데이터를 localStorage에 저장합니다.
//3. createJSONStorage를 사용하여 JSON 형식으로 데이터를 저장합니다.
//4. set 함수를 사용하여 상태를 업데이트하는 메서드를 정의합니다.
//5. addBoard, removeBoard, updateBoard 메서드를 사용하여 보드를 추가, 삭제 및 업데이트합니다.
//6. data는 보드의 배열을 저장합니다. 초기값은 빈 배열 입니다. []
//7. addBoard 메서드는 새로운 보드를 추가합니다.
//8. removeBoard 메서드는 특정 ID를 가진 보드를 삭제합니다.
//9. updateBoard 메서드는 특정 ID를 가진 보드를 업데이트합니다.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// useBoardStore: Kanban 보드 상태 관리용 zustand store
const useBoardStore = create(
  persist(
    (set) => ({
      // 1. 보드 데이터 배열 (초기값: 빈 배열)
      data: [],

      // 2. 새로운 보드 추가하기
      addBoard: (item) =>
        set((state) => ({
          data: [...state.data, item],
        })),

      // 3. 특정 보드 삭제 (id 기준)
      removeBoard: (id) =>
        set((state) => ({
          data: state.data.filter((item) => item.id !== id),
        })),

      // 4. 특정 보드 수정 (id 기준)
      updateBoard: (updatedItem) =>
        set((state) => ({
          data: state.data.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        })),
    }),
    {
      name: 'kanban-storage', // localStorage key 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBoardStore;
