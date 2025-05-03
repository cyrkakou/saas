# API Reference

This document provides a comprehensive reference for the API endpoints available in the application.

## API Structure

The API follows RESTful principles with versioning to ensure backward compatibility:

```
/api/v{version}/{resource}/{id?}/{sub-resource?}
```

All API endpoints use standard HTTP methods:
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update resources
- `DELETE` - Delete resources

## Authentication

Most API endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer {token}
```

## Error Handling

API errors follow a consistent format:

```json
{
  "error": "Error message",
  "details": [
    // Optional validation errors or additional information
  ]
}
```

Common HTTP status codes:
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (e.g., validation error)
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate name)
- `500 Internal Server Error` - Server error

## Pagination

List endpoints support pagination using query parameters:

- `limit` - Number of items per page (default: 10)
- `offset` - Number of items to skip (default: 0)

Example: `/api/v1/users?limit=20&offset=40`

## Sorting

List endpoints support sorting using query parameters:

- `sort` - Field to sort by
- `order` - Sort order (`asc` or `desc`)

Example: `/api/v1/users?sort=createdAt&order=desc`

## Filtering

List endpoints support filtering using resource-specific query parameters.

Example: `/api/v1/reports?type=financial&year=2023`

---

## Users

### Get All Users

```
GET /api/v1/users
```

Query parameters:
- `role` - Filter by role ID
- `organization` - Filter by organization ID
- `isActive` - Filter by active status (`true` or `false`)

### Get User by ID

```
GET /api/v1/users/{id}
```

### Create User

```
POST /api/v1/users
```

Request body:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "roleId": "role-id",
  "organizationId": "organization-id"
}
```

### Update User

```
PUT /api/v1/users/{id}
```

Request body:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "isActive": true
}
```

### Delete User

```
DELETE /api/v1/users/{id}
```

### Get User Roles

```
GET /api/v1/users/{id}/roles
```

### Assign Role to User

```
POST /api/v1/users/{id}/roles
```

Request body:
```json
{
  "roleId": "role-id"
}
```

### Remove Role from User

```
DELETE /api/v1/users/{id}/roles
```

Request body:
```json
{
  "roleId": "role-id"
}
```

### Get User Reports

```
GET /api/v1/users/{id}/reports
```

### Assign Report to User

```
POST /api/v1/users/{id}/reports
```

Request body:
```json
{
  "reportId": "report-id"
}
```

---

## Roles

### Get All Roles

```
GET /api/v1/roles
```

### Get Role by ID

```
GET /api/v1/roles/{id}
```

### Create Role

```
POST /api/v1/roles
```

Request body:
```json
{
  "name": "Admin",
  "description": "Administrator role with full access"
}
```

### Update Role

```
PUT /api/v1/roles/{id}
```

Request body:
```json
{
  "name": "Updated Role Name",
  "description": "Updated description"
}
```

### Delete Role

```
DELETE /api/v1/roles/{id}
```

### Get Role Permissions

```
GET /api/v1/roles/{id}/permissions
```

### Assign Permissions to Role

```
POST /api/v1/roles/{id}/permissions
```

Request body:
```json
{
  "permissionIds": ["permission-id-1", "permission-id-2"]
}
```

### Remove Permissions from Role

```
DELETE /api/v1/roles/{id}/permissions
```

Request body:
```json
{
  "permissionIds": ["permission-id-1", "permission-id-2"]
}
```

---

## Permissions

### Get All Permissions

```
GET /api/v1/permissions
```

Query parameters:
- `resource` - Filter by resource name

### Get Permission by ID

```
GET /api/v1/permissions/{id}
```

### Create Permission

```
POST /api/v1/permissions
```

Request body:
```json
{
  "name": "Create Users",
  "description": "Permission to create new users",
  "resource": "users",
  "action": "create"
}
```

### Update Permission

```
PUT /api/v1/permissions/{id}
```

Request body:
```json
{
  "name": "Updated Permission Name",
  "description": "Updated description",
  "resource": "users",
  "action": "create"
}
```

### Delete Permission

```
DELETE /api/v1/permissions/{id}
```

---

## Organizations

### Get All Organizations

```
GET /api/v1/organizations
```

### Get Organization by ID

```
GET /api/v1/organizations/{id}
```

### Create Organization

```
POST /api/v1/organizations
```

Request body:
```json
{
  "name": "Acme Inc.",
  "description": "Technology company",
  "website": "https://example.com",
  "email": "contact@example.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St, City, Country",
  "logo": "https://example.com/logo.png"
}
```

### Update Organization

```
PUT /api/v1/organizations/{id}
```

Request body:
```json
{
  "name": "Updated Organization Name",
  "description": "Updated description",
  "website": "https://updated-example.com"
}
```

### Delete Organization

```
DELETE /api/v1/organizations/{id}
```

### Get Organization Users

```
GET /api/v1/organizations/{id}/users
```

### Add User to Organization

```
POST /api/v1/organizations/{id}/users
```

Request body:
```json
{
  "userId": "user-id"
}
```

### Remove User from Organization

```
DELETE /api/v1/organizations/{id}/users
```

Request body:
```json
{
  "userId": "user-id"
}
```

### Get Organization Reports

```
GET /api/v1/organizations/{id}/reports
```

### Assign Report to Organization

```
POST /api/v1/organizations/{id}/reports
```

Request body:
```json
{
  "reportId": "report-id"
}
```

### Remove Report from Organization

```
DELETE /api/v1/organizations/{id}/reports
```

Request body:
```json
{
  "reportId": "report-id"
}
```

---

## Reports

### Get All Reports

```
GET /api/v1/reports
```

Query parameters:
- `type` - Filter by report type (`financial`, `usage`, `performance`, `custom`)
- `organizationId` - Filter by organization ID
- `createdById` - Filter by creator user ID
- `isPublic` - Filter by public status (`true` or `false`)

### Get Report by ID

```
GET /api/v1/reports/{id}
```

### Create Report

```
POST /api/v1/reports
```

Request body:
```json
{
  "name": "Monthly Financial Report",
  "description": "Financial report for the current month",
  "type": "financial",
  "config": "{\"period\":\"monthly\",\"metrics\":[\"revenue\",\"expenses\"]}",
  "createdById": "user-id",
  "organizationId": "organization-id",
  "isPublic": false
}
```

### Update Report

```
PUT /api/v1/reports/{id}
```

Request body:
```json
{
  "name": "Updated Report Name",
  "description": "Updated description",
  "isPublic": true
}
```

### Delete Report

```
DELETE /api/v1/reports/{id}
```

---

## Settings

### Get All Settings

```
GET /api/v1/settings
```

### Get Public Settings

```
GET /api/v1/settings?isPublic=true
```

### Get Setting by ID

```
GET /api/v1/settings/{id}
```

### Create Setting

```
POST /api/v1/settings
```

Request body:
```json
{
  "key": "site.title",
  "value": "My Application",
  "description": "The title of the application",
  "isPublic": true
}
```

### Update Setting

```
PUT /api/v1/settings/{id}
```

Request body:
```json
{
  "value": "Updated Value",
  "description": "Updated description",
  "isPublic": false
}
```

### Delete Setting

```
DELETE /api/v1/settings/{id}
```

---

## Subscriptions

### Get All Subscriptions

```
GET /api/v1/subscriptions
```

Query parameters:
- `userId` - Filter by user ID
- `status` - Filter by status (`active`, `canceled`, `expired`)

### Get Subscription by ID

```
GET /api/v1/subscriptions/{id}
```

### Create Subscription

```
POST /api/v1/subscriptions
```

Request body:
```json
{
  "userId": "user-id",
  "planId": "plan-id",
  "startDate": "2023-01-01T00:00:00Z",
  "endDate": "2024-01-01T00:00:00Z",
  "status": "active"
}
```

### Update Subscription

```
PUT /api/v1/subscriptions/{id}
```

Request body:
```json
{
  "status": "canceled",
  "endDate": "2023-06-01T00:00:00Z"
}
```

### Delete Subscription

```
DELETE /api/v1/subscriptions/{id}
```
