import { db } from '@/lib/db';
import { inMemoryStore } from '@/lib/storage';
import { MemoryVaultItem, MemoryCategory } from '@/types/memory';

export class MemoryService {
  async getAllItems(): Promise<MemoryVaultItem[]> {
    try {
      const items = await db.memoryItem.findMany({
        orderBy: { lastUsedAt: 'desc' },
      });

      if (items.length > 0) {
        return items.map((i) => ({
          id: i.id,
          key: i.key,
          value: i.value,
          category: i.category as MemoryCategory,
          isSecret: false,
          tags: [],
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.lastUsedAt.toISOString(),
        }));
      }
    } catch {
      // Fallback to inMemoryStore
    }

    return Array.from(inMemoryStore.memories.values()).map((m) => ({
      id: m.id,
      key: m.key,
      value: m.value,
      category: m.category as MemoryCategory,
      isSecret: false,
      tags: [],
      createdAt: m.createdAt,
      updatedAt: m.lastUsedAt,
    }));
  }

  async setItem(key: string, value: string, category: MemoryCategory = 'environment', isSecret = false, tags: string[] = []): Promise<MemoryVaultItem> {
    try {
      const dbItem = await db.memoryItem.create({
        data: { key, value, category },
      });

      return {
        id: dbItem.id,
        key: dbItem.key,
        value: dbItem.value,
        category: dbItem.category as MemoryCategory,
        isSecret: false,
        tags,
        createdAt: dbItem.createdAt.toISOString(),
        updatedAt: dbItem.lastUsedAt.toISOString(),
      };
    } catch {
      const memId = `mem_${Date.now()}`;
      const item: MemoryVaultItem = {
        id: memId,
        key,
        value,
        category,
        isSecret,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.memories.set(memId, {
        id: memId,
        key,
        value,
        category,
        confidence: 1.0,
        useCount: 1,
        lastUsedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      return item;
    }
  }

  async deleteItem(key: string): Promise<boolean> {
    try {
      const item = await db.memoryItem.findFirst({ where: { key } });
      if (item) {
        await db.memoryItem.delete({ where: { id: item.id } });
        return true;
      }
    } catch {
      for (const [id, item] of inMemoryStore.memories.entries()) {
        if (item.key === key) {
          inMemoryStore.memories.delete(id);
          return true;
        }
      }
    }
    return false;
  }
}

export const memoryService = new MemoryService();
