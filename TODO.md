# TODO - Trash Section Implementation

## Backend
- [ ] Add Trash DTO/response for frontend (include trashItemId, originalName/originalPath, deletedAt, fileType, fileSize, canRestore based on autoDeleteAt).
- [ ] Extend `FileService` interface with methods for:
  - [ ] listTrashItems(userId)
  - [ ] restoreTrashItem(userId, trashItemId)
  - [ ] permanentlyDeleteTrashItem(userId, trashItemId)
  - [ ] emptyTrash(userId)
- [ ] Implement above in `FileServiceImpl` using existing `restoreFromTrash` and `permanentlyDeleteFromTrash` logic.
- [ ] Add REST endpoints in `FileController`:
  - [ ] GET `/files/trash`
  - [ ] POST `/files/trash/{trashItemId}/restore`
  - [ ] DELETE `/files/trash/{trashItemId}/permanent-delete`
  - [ ] DELETE `/files/trash/empty`
- [ ] When moving to trash in `deleteFile`, set `trashItem.autoDeleteAt = now + 30 days`.
- [ ] Ensure returned trash list excludes already permanently deleted items.

## Frontend
- [ ] Update `TrashPage.jsx` to remove mock data and call `fileService.listTrashItems()`.
- [ ] Wire restore, permanent delete, and empty trash actions to backend endpoints.
- [ ] Use backend-provided canRestore/autoDeleteAt to determine UI state.
- [ ] Keep list/grid/sorting/selection UI functional with real data.

## Verification
- [ ] Run backend build/tests.
- [ ] Run frontend build.
- [ ] Manually verify: delete file -> appears in Trash; restore -> returns to My Files; permanent delete -> removed; empty trash -> cleared.

