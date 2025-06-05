import ArchivePageWrapper from "@/components/ArchivePageWrapper";
import React from 'react';

export default function ArchiveTab() {
  return (
    <ArchivePageWrapper
      onLoadArchivedNote={(note) => {
        // Handle note loading if needed - currently handled by navigation in ArchivePageWrapper
      }}
    />
  );
} 