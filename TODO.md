# TODO - Multi-user Isolation Fix (CloudDrive)

## Phase 0: Read-only confirmation (done)
- [x] Read PROJECT ANALYSIS REPORT.docx
- [x] Read AWS-DEPLOYMENT-PLAN.md
- [x] Read temp_doc.txt (PRD content)
- [x] Read backend auth + file endpoints wiring
- [x] Read critical backend code paths:
  - [x] AuthServiceImpl.java (OTP + JWT)
  - [x] FileServiceImpl.java (upload/move IDOR + file access)
  - [x] FileController.java
- [x] Read auth + security helpers:
  - [x] JwtAuthenticationFilter.java
  - [x] JwtService.java
  - [x] GlobalExceptionHandler.java
- [x] Read frontend services/pages:
  - [x] activityService.js (localStorage + userId hardcoded)
  - [x] favoritesService.js
  - [x] DashboardPage.jsx
  - [x] TrashPage.jsx (mock)
  - [x] RecentPage.jsx (activityService)
  - [x] SearchPage.jsx (mock)

## Phase 1: Security-critical backend fixes (waiting for approval)
- [ ] Fix folder IDOR for file upload/move:
  - [ ] FileServiceImpl.uploadFile: validate folder ownership
  - [ ] FileServiceImpl.assignFileToFolder: validate folder ownership
- [ ] Harden file-by-id authorization for all file operations:
  - [ ] getFileDetails
  - [ ] downloadFile
  - [ ] deleteFile
  - [ ] star/unstar
  - [ ] trash restore/permanent delete (if endpoints exist)
  - [ ] search/recent (if endpoints exist)
- [ ] Add consistent 403 handling for unauthorized access.

## Phase 2: Frontend isolation fixes (waiting for approval)
- [ ] Prevent per-user leakage in activityService:
  - [ ] scope localStorage keys by user (or clear on auth change)
  - [ ] remove hardcoded userId: 'current-user'
- [ ] Remove mock data pages or gate behind “no backend mode”
  - [ ] TrashPage.jsx
  - [ ] SearchPage.jsx
- [ ] Remove hardcoded API base URL in fileService.js; use shared api.js.

## Phase 3: Verification
- [ ] Backend smoke tests (manual/CLI):
  - [ ] User A uploads file
  - [ ] User B logs in → /files must not show A’s file
  - [ ] User B tries accessing A’s fileId → must be 403/404
  - [ ] User B tries using A’s folderId for upload/move → must be 400/403
- [ ] Frontend smoke tests:
  - [ ] logout/login between users clears previous state
  - [ ] Recent/Trash/Search show correct per-user data


