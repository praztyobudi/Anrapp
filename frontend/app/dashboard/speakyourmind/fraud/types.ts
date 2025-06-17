export type Fraud = {
  id: number;
  user_id: number;
  fraud_message: string;
  updated_at: string;
  created_at: string;
};
export type propsFormFraud = {
  onSubmit: (data: Fraud) => Promise<{ success: boolean; error?: Error }>;
  defaultValue?: Fraud;
  mode: "create" | "edit";
  onCancel?: () => void;
  userId: number;
};
export type propsRiwayatFraud = {
  editKrisar: (krisar: Fraud) => void;
  deleteKrisar: (id: number) => Promise<{ success: boolean; error?: Error }>;
  krisars: Fraud[];
  refreshData: () => Promise<{ success: boolean; error?: Error }>;
  statusMsg: string;
};
