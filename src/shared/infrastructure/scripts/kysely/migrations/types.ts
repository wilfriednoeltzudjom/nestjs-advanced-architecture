export type TemplateType = 'create-table' | 'add-column' | 'create-index' | 'empty';

export const TEMPLATE_TYPES: TemplateType[] = ['create-table', 'add-column', 'create-index', 'empty'];

export function isTemplateType(value: string): value is TemplateType {
  return TEMPLATE_TYPES.includes(value as TemplateType);
}
