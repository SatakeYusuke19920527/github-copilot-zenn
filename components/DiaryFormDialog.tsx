'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Diary } from '@/features/diary/diarySlice';
import { useState } from 'react';

type Mode = 'create' | 'edit';

export function DiaryFormDialog({
  mode,
  open,
  onOpenChange,
  diary,
  onSubmit,
}: {
  mode: Mode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diary?: Diary | null;
  onSubmit: (payload: { title: string; content: string }) => void;
}) {
  const [title, setTitle] = useState(() => diary?.title ?? '');
  const [content, setContent] = useState(() => diary?.content ?? '');
  const [error, setError] = useState<string | null>(null);

  const dialogTitle = mode === 'create' ? '新規作成' : '編集';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">タイトル（必須）</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 今日の出来事"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">本文（必須）</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今日あったこと、感じたこと…"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            onClick={() => {
              const trimmedTitle = title.trim();
              const trimmedContent = content.trim();
              if (!trimmedTitle || !trimmedContent) {
                setError('タイトルと本文は必須です。');
                return;
              }
              onSubmit({ title: trimmedTitle, content: trimmedContent });
              onOpenChange(false);
            }}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
