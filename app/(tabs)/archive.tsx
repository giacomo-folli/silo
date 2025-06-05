import React from 'react';
import ArchivePageWrapper from "../../components/ArchivePageWrapper";

export default function ArchiveTab() {
  return (
    <ArchivePageWrapper
      onLoadArchivedNote={(note) => {
        // Handle note loading if needed - currently handled by navigation in ArchivePageWrapper
      }}
    />
  );
}