'use client';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DiaryFormDialog } from '@/components/DiaryFormDialog';
import { DiaryList } from '@/components/DiaryList';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import {
  addDiary,
  deleteDiary,
  updateDiary,
} from '@/features/diary/diarySlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useMemo, useState } from 'react';

export default function HomePage() {
  const diaries = useAppSelector((s) => s.diary.diaries);
  const dispatch = useAppDispatch();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSession, setFormSession] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingDiary = useMemo(
    () => diaries.find((d) => d.id === editingId) ?? null,
    [diaries, editingId]
  );

  const deletingDiary = useMemo(
    () => diaries.find((d) => d.id === deletingId) ?? null,
    [diaries, deletingId]
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">日記</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Redux Toolkit でローカルCRUD（永続化なし）
          </p>
        </header>

        <DiaryList
          diaries={diaries}
          onEdit={(id) => {
            setFormMode('edit');
            setEditingId(id);
            setFormSession((s) => s + 1);
            setFormOpen(true);
          }}
          onDelete={(id) => {
            setDeletingId(id);
            setConfirmOpen(true);
          }}
        />
      </main>

      <FloatingAddButton
        onClick={() => {
          setFormMode('create');
          setEditingId(null);
          setFormSession((s) => s + 1);
          setFormOpen(true);
        }}
      />

      <DiaryFormDialog
        key={formSession}
        mode={formMode}
        open={formOpen}
        onOpenChange={setFormOpen}
        diary={formMode === 'edit' ? editingDiary : null}
        onSubmit={({ title, content }) => {
          if (formMode === 'create') {
            dispatch(addDiary({ title, content }));
            return;
          }

          if (!editingId) return;
          dispatch(updateDiary({ id: editingId, title, content }));
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="削除しますか？"
        description={
          deletingDiary
            ? `「${deletingDiary.title}」を削除します。`
            : 'この日記を削除します。'
        }
        confirmLabel="削除"
        destructive
        onConfirm={() => {
          if (!deletingId) return;
          dispatch(deleteDiary({ id: deletingId }));
          setDeletingId(null);
        }}
      />
    </div>
  );
}
