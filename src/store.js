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

// Kanban 보드 상태 관리 스토어
const useBoardStore = create(
  persist(
    (set, get) => ({
      // 보드 데이터 배열, order 필드 포함
      data: [],

      // 새로운 보드 추가 (order는 현재 데이터 길이로 자동 부여)
      addBoard: (item) =>
        set((state) => ({
          data: [
            ...state.data,
            {
              ...item,
              order: item.order ?? state.data.length, // order가 없으면 마지막 순서로 지정
            },
          ],
        })),

      // 특정 보드 삭제 (id 기준)
      removeBoard: (id) =>
        set((state) => ({
          data: state.data.filter((item) => item.id !== id),
        })),

      // 특정 보드 수정 (id 기준, order 포함해서 수정 가능)
      updateBoard: (updatedItem) =>
        set((state) => ({
          data: state.data.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
          ),
        })),

      // 보드 타입 변경 (id 기준)
      updateBoardType: (id, newType) =>
        set((state) => {
          const updatedData = state.data.map((item) =>
            item.id === id ? { ...item, type: newType } : item
          );

          // 타입 변경 시, 해당 항목 order도 재조정 필요
          // 새 타입에 속한 항목들 order 재설정 (끝에 추가)
          const changedItem = updatedData.find((item) => item.id === id);
          if (!changedItem) return { data: updatedData };

          const sameTypeItems = updatedData
            .filter((item) => item.type === newType)
            .sort((a, b) => a.order - b.order);

          // 변경된 항목이 새 타입 내 마지막 순서가 되도록 order 부여
          const maxOrder =
            sameTypeItems.length > 0
              ? Math.max(...sameTypeItems.map((item) => item.order))
              : -1;

          const newData = updatedData.map((item) =>
            item.id === id ? { ...item, order: maxOrder + 1 } : item
          );

          return { data: newData };
        }),

      // 아이템 순서 재조정 (드래그앤드롭 후 전체 배열 교체)
    reorderItems: (newData) =>
        set(() => ({
            data: newData,
        })),
    }),
    {
      name: 'kanban-storage', // localStorage key 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBoardStore;
