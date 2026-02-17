'use client';

import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL environment variable is not set');
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
