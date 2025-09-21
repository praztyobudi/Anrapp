export type Idea = {
  id: number;
  from: string;
  to: string;
  idea: string;
  // date: string;
  updated_at: string;
  created_at: string;
};

export type propsRiwayatIde = {
  onEdit: (idea: Idea) => void;
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  refreshData: () => Promise<{success: boolean; error?: Error}>;
  statusMsg: string;
};

export type propsFormIde = {
  onSubmit: (data: Idea) => Promise<{ success: boolean; error?: Error }>;
  defaultValue?: Idea;
  mode: "create" | "edit";
  onCancel?: () => void;
  refreshData: () => Promise<{success: boolean; error?: Error}>;
};
// export type ApiIdea = {
//   id: number;
//   name: string;
//   department: string;
//   message: string;
//   created_at: string;
// };
