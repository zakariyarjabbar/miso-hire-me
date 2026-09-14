'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ServiceId } from '@/lib/content';
import { localStore } from '@/lib/storage';

/** A deliberate service click updates a draft; refreshing that draft keeps later edits. */
export function ServiceLink({
  service,
  className,
  children,
}: {
  service: ServiceId;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/hire/?service=${service}`}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        localStore.initialize();
        if (!localStore.getSnapshot().data.draft) return;
        localStore.mutate((data) => ({
          ...data,
          draft: data.draft
            ? {
                ...data.draft,
                prefillService: service,
                step: 1,
                updatedAt: new Date().toISOString(),
                fields: { ...data.draft.fields, serviceId: service },
              }
            : null,
        }));
      }}
    >
      {children}
    </Link>
  );
}
