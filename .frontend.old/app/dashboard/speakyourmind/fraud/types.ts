export type Fraud = {
  types: string;
  id: number;
  user_id: number;
  fraud_message: string;
  type_message: string;
  created_at: string;
  updated_at: string;
};

export type FraudReq = {
  id?: number;
  fraud_message: string;
  types: string;
};

export type propsFormFraud = {
  onSubmit: (fraud: FraudReq) => Promise<{ success: boolean; error?: Error }>;
  defaultValue?: FraudReq;
  mode: "create" | "edit";
  onCancel?: () => void;
  isLoading?: boolean;
  refreshData: () => Promise<{success: boolean; error?: Error}>;
};

export type propsRiwayatFraud = {
  frauds: Fraud[];
  editFraud: (fraud: Fraud) => void;
  deleteFraud: (id: number) => void;
  refreshData: () => Promise<{success: boolean; error?: Error}>;
  statusMsg: string;
  isLoading: boolean;
  error: string | null;
};
