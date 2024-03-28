import { create } from "zustand";

type StoreState = {
  caseLabel: string;
};

type Action = {
  updateCaseLabel: (caseLabel: StoreState["caseLabel"]) => void;
};

const useSearchStore = create<StoreState & Action>((set) => ({
  caseLabel: "",
  updateCaseLabel: (caseLabel) => set(() => ({ caseLabel })),
}));

export default useSearchStore;
