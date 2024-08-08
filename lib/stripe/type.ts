export type Price = {
    active: boolean | null;
    currency: string | null;
    id: string;
    interval: string | null;
    interval_count: number | null;
    product_id: string | null;
    trial_period_days: number | null;
    type: "one_time" | "recurring" | null;
    unit_amount: number | null;
  };