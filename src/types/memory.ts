/**
 * Memory Vault & Credentials Types
 */

export type MemoryCategory = 'environment' | 'secret' | 'credential' | 'macro' | 'knowledge';

export interface MemoryVaultItem {
  id: string;
  key: string;
  value: string;
  category: MemoryCategory;
  isSecret: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MacroSnippet {
  id: string;
  name: string;
  description: string;
  commandPattern: string;
  category: string;
}
