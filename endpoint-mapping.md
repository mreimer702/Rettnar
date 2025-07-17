# Frontend-Backend Endpoint Mapping

## Authentication Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `POST /users/login` | `POST /api/auth/login` | ✅ NEEDS FRONTEND UPDATE | Backend implemented, frontend needs to change to `/api/auth/login` |
| `POST /users/register` | `POST /api/users/register` | ✅ ALIGNED | Both implemented and aligned |
| `POST /auth/logout` | `POST /api/auth/logout` | ✅ NEEDS FRONTEND UPDATE | Backend implemented, frontend needs to change to `/api/auth/logout` |

## User Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `GET /users/profile` | `GET /api/users/profile` | ✅ ALIGNED | Both implemented |
| `PUT /users/profile` | `PUT /api/users/profile` | ✅ ALIGNED | Both implemented |
| `POST /users/avatar` | `POST /api/users/avatar` | ❌ MISSING | Need to implement avatar upload |

## Listings Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `GET /listings/nearby` | `GET /api/listings/` (with lat/lng params) | ❌ NEEDS IMPLEMENTATION | Need to add nearby filtering |
| `GET /listings/{id}` | `GET /api/listings/{id}` | ✅ ALIGNED | Need to verify implementation |
| `POST /listings` | `POST /api/listings/` | ✅ ALIGNED | Both implemented |
| `PUT /listings/{id}` | `PUT /api/listings/{id}` | ✅ ALIGNED | Need to verify implementation |
| `GET /listings/search` | `GET /api/listings/` (with search params) | ✅ ALIGNED | Using existing filter system |

## Bookings Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `POST /bookings` | `POST /api/bookings` | ✅ ALIGNED | Both implemented |
| `GET /bookings` | `GET /api/bookings` (admin only) | ❌ NEEDS USER ENDPOINT | Need user-specific booking endpoint |
| `GET /bookings/{id}` | `GET /api/bookings/{id}` | ✅ ALIGNED | Need to verify implementation |
| `PUT /bookings/{id}` | `PUT /api/bookings/{id}` | ✅ ALIGNED | Both implemented |
| `DELETE /bookings/{id}` | `DELETE /api/bookings/{id}` | ❌ MISSING | Need to implement cancellation |

## Messages Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `GET /messages/conversations` | ❌ MISSING | ❌ MISSING | Need to implement messaging system |
| `GET /messages/{conversationId}` | ❌ MISSING | ❌ MISSING | Need to implement messaging system |
| `POST /messages/{conversationId}` | ❌ MISSING | ❌ MISSING | Need to implement messaging system |

## Notifications Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `GET /notifications/general` | `GET /api/notifications/general` | ✅ ALIGNED | Both implemented |
| `PUT /notifications/general/{id}` | `PUT /api/notifications/general/{id}` | ✅ ALIGNED | Both implemented |
| `PUT /notifications/general/mark-all-read` | `PUT /api/notifications/general/mark-all-read` | ❌ MISSING | Need to implement bulk read |

## Payments Endpoints

| Frontend Expectation | Backend Implementation | Status | Notes |
|---------------------|----------------------|--------|-------|
| `POST /payments` | `POST /api/payments` | ✅ ALIGNED | Both implemented |

## Summary

### ✅ Aligned (7)
- User registration, profile get/update
- Listings create, basic operations
- Bookings create, update
- Notifications get, mark individual as read
- Payments create

### 🔄 Needs Frontend Update (2)
- Auth login endpoint
- Auth logout endpoint

### ❌ Missing Backend Implementation (8)
- Avatar upload
- Nearby listings filtering
- User-specific bookings endpoint
- Booking cancellation
- Complete messaging system (3 endpoints)
- Bulk mark notifications as read

### 📝 Action Items

1. **Phase 1 Priority**: Implement missing backend endpoints
2. **Phase 2 Priority**: Update frontend to use correct auth endpoints
3. **Phase 3 Priority**: Test all endpoint integrations 