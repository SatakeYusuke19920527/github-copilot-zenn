'use client';

import { Button } from '@/components/ui/button';

export function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
      aria-label="日記を追加"
      title="新規作成"
    >
      <span className="text-2xl leading-none">+</span>
    </Button>
  );
}
