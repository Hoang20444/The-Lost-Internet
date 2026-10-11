import type { InteractableId } from './game';

export type ClueCategory = 'RECOVERED' | 'OBSERVATION' | 'SIGNAL' | 'PROTOCOL';

export interface Clue {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  sourceId: InteractableId;
  category: ClueCategory;
  caseFile?: string;
  discoveredAt: string;
}

export interface ClueDefinition {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  sourceId: InteractableId;
  category: ClueCategory;
  caseFile?: string;
}
