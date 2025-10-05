export interface AlarmTable {
  id: string;
  name: string;
  severity: string;
  triggered_at: Date;
  is_acknowledged: boolean;
  created_at: Date;
  updated_at: Date;
}
