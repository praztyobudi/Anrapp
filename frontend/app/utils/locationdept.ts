const CATEGORY_LABELS = {
  ho: "Head Office",
  pabrik: "Pabrik",
  default: "Lainnya",
};

export function locationDept(department: string | null | undefined): string {
    if (!department) return CATEGORY_LABELS.default;
  
    const ho = ["umum", "hc", "finance", "purchase", "warehouse", "marketing"];
    const pabrik = ["maa", "qc", "lab", "rnd", "principal", "pramaterial"];
    const dept = department.toLowerCase();
  
    if (ho.includes(dept)) return CATEGORY_LABELS.ho;
    if (pabrik.includes(dept)) return CATEGORY_LABELS.pabrik;
  
    return CATEGORY_LABELS.default;
  }
  