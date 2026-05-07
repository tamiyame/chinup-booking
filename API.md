# Chin-up Performance — New API Endpoints

These endpoints must be added to the backend to support the new React frontend.

## Existing endpoints (unchanged)

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
GET    /api/auth/google
```

## New endpoints required

### Recurring Courses (帶狀課程)

```
GET  /api/courses?period_id=p3
```
Returns all published recurring courses for the given period.

Response:
```json
[
  {
    "id": 1,
    "name": "重量訓練・進階",
    "description": "三大項加上輔助動作",
    "dow": 1,
    "dow_label": "一",
    "time": "19:00",
    "duration_minutes": 60,
    "min_capacity": 3,
    "max_capacity": 8,
    "sessions_per_period": 8,
    "price_per_period": 8800,
    "tag": "進階",
    "coach_name": "陳冠宇 Kuan-Yu Chen",
    "coach_tagline": "競技表現・爆發力",
    "status": "published"
  }
]
```

```
POST /api/courses/:id/register
```
Register current user for the full period.

Body: `{ "period_id": "p3" }`

Response: `{ "id": 42, "status": "confirmed" }` or `{ "id": 42, "status": "waitlisted", "position": 2 }`

### My Course Registrations

```
GET  /api/my/course-registrations?period_id=p3
```
Returns current user's registrations for the given period.

Response:
```json
[
  {
    "id": 42,
    "course_id": 1,
    "course_name": "重量訓練・進階",
    "period_id": "p3",
    "status": "active",
    "dow_label": "一",
    "time": "19:00",
    "coach_name": "陳冠宇",
    "total": 8,
    "attended": 3,
    "upcoming": 4,
    "leave": 1,
    "transferable": 1
  }
]
```

```
DELETE /api/registrations/:id
```
Cancel a registration (existing endpoint, keep).

```
POST /api/registrations/:id/transfer
```
Transfer a leave slot to another user.

Body: `{ "recipient": "email@example.com" }`

### Add-on single sessions

```
GET  /api/addons?period_id=p3
```
Returns available single-session add-ons for the period.

Response:
```json
[
  {
    "id": 1,
    "course_id": 3,
    "course_name": "HIIT 高強度間歇",
    "date": "2026/05/13",
    "dow_label": "三",
    "time": "19:30",
    "price": 800,
    "available": 4
  }
]
```

```
POST /api/addons/:id/register
```
Register for an add-on session.

### Coaches

```
GET  /api/coaches
```
Returns list of coaches.

Response:
```json
[
  {
    "id": "c1",
    "name": "陳冠宇 Kuan-Yu Chen",
    "tagline": "競技表現・爆發力",
    "bio": "前國家代表隊體能教練...",
    "certifications": ["NSCA-CSCS", "USAW-1"],
    "tags": ["競技訓練", "爆發力"],
    "rate_per_session": 1800,
    "photo_url": null
  }
]
```

```
GET  /api/coaches/:id
```
Returns single coach detail.

```
GET  /api/coaches/:id/slots
```
Returns available booking slots for the coach.

Response:
```json
[
  {
    "date": "05/08",
    "day_label": "週五",
    "times": ["09:00", "10:00", "14:00"]
  }
]
```

```
POST /api/coaches/:id/book
```
Book a 1-on-1 session.

Body: `{ "date": "05/08", "time": "14:00" }`

Response: `{ "id": 99, "gcal_event_id": "xxx", "invite_sent": true }`

### Admin endpoints

```
GET    /api/admin/stats
GET    /api/admin/courses
POST   /api/admin/courses
PATCH  /api/admin/courses/:id
GET    /api/admin/users
```

`GET /api/admin/stats` response:
```json
{ "templates": 5, "courses": 6, "regs": 42, "waitlist": 3 }
```

`GET /api/admin/courses` returns courses with `period_label`, `dow_label`, `time`, `coach_name`, `status`.
