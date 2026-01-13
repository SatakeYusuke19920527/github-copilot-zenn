'use client';

/* eslint-disable @next/next/no-img-element */

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Diary } from '@/features/diary/diarySlice';

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DiaryCard({
  diary,
  onEdit,
  onDelete,
}: {
  diary: Diary;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const snippet =
    diary.content.length > 120
      ? `${diary.content.slice(0, 120)}…`
      : diary.content;

  return (
    <Card className="w-full">
      <div className="overflow-hidden rounded-t-xl border-b border-foreground/10">
        <img
          src={diary.imageUrl}
          alt={diary.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </div>
      <CardHeader>
        <CardTitle className="truncate">{diary.title}</CardTitle>
        <CardDescription>更新: {formatDate(diary.updatedAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-foreground/80">
          {snippet}
        </p>
        <p className="mt-3 text-xs text-foreground/60">
          Photo via{' '}
          <a
            className="underline underline-offset-4 hover:text-foreground"
            href="https://unsplash.com/ja"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary" onClick={() => onEdit(diary.id)}>
          Edit
        </Button>
        <Button variant="outline" onClick={() => onDelete(diary.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
