export type Idea = {
  id: number;
  from: string;
  to: string;
  idea: string;
  date: string;
};

export type propsRiwayatIde = {
  onEdit: (idea: Idea) => void;
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  refreshData: () => Promise<void>;
  statusMsg: string;
};

export type propsFormIde = {
  onSubmit: (data: Idea) => Promise<{ success: boolean; error?: Error }>;
  defaultValue?: Idea;
  mode: "create" | "edit";
  onCancel?: () => void;
};
// export type ApiIdea = {
//   id: number;
//   name: string;
//   department: string;
//   message: string;
//   created_at: string;
// };
