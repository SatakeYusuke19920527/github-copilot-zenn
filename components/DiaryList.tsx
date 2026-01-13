'use client';

import { DiaryCard } from '@/components/DiaryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Diary } from '@/features/diary/diarySlice';

export function DiaryList({
  diaries,
  onEdit,
  onDelete,
}: {
  diaries: Diary[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (diaries.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>日記がまだありません</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70">
            右下の + から最初の1件を作成しましょう。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {diaries.map((d) => (
        <DiaryCard key={d.id} diary={d} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
