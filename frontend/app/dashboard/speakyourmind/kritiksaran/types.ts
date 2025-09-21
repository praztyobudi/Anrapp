export type Krisar = {
  id: number;
  user_id: number;
  critique: string;
  suggestion: string;
  updated_at: string;
  created_at: string;
  user_name?: string;
};

export type userData = {
  id: number;
  name: string;
  // username: string;
  // department: string;
  // role: string;
};

export type propsFormKrisar = {
  onSubmit: (data: Krisar) => Promise<{ success: boolean; error?: Error }>;
  defaultValue?: Krisar;
  mode: "create" | "edit";
  onCancel?: () => void;
  userId: number;
};

export type propsRiwayatKrisar = {
  userData: string | null;
  editKrisar: (krisar: Krisar) => void;
  deleteKrisar: (id: number) => Promise<{success: boolean; error?: Error}>;
  krisars: Krisar[];
  refreshData: () => Promise<{success: boolean; error?: Error}>;
  statusMsg: string;
};
// export type ApiIdea = {
//   id: number;
//   name: string;
//   department: string;
//   message: string;
//   created_at: string;
// };
