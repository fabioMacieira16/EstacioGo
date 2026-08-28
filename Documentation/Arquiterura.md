campus-route/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── login/
│   │   └── index.tsx
│   │
│   ├── home/
│   │   └── index.tsx
│   │
│   ├── navigation/
│   │   └── [roomId].tsx
│   │
│   ├── rooms/
│   │   └── index.tsx
│   │
│   └── admin/
│       ├── index.tsx
│       ├── rooms.tsx
│       └── routes.tsx
│
├── src/
│   │
│   ├── components/
│   │   ├── Map/
│   │   ├── RoomCard/
│   │   ├── SearchRoom/
│   │   ├── RouteInfo/
│   │   └── Loading/
│   │
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   └── firestore.ts
│   │   │
│   │   ├── roomService.ts
│   │   └── routeService.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRooms.ts
│   │   └── useLocation.ts
│   │
│   ├── types/
│   │   ├── Room.ts
│   │   ├── Route.ts
│   │   └── User.ts
│   │
│   ├── utils/
│   │   ├── distance.ts
│   │   └── coordinates.ts
│   │
│   └── constants/
│       └── map.ts
│
├── assets/
│   ├── images/
│   └── maps/
│
├── firestore.rules
├── app.json
├── package.json
└── README.md