'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return <button type="button" className="button button-outline checklist-print" onClick={() => window.print()}><Printer size={17} aria-hidden="true" />Print checklist</button>;
}
