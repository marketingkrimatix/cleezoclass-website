'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function StudentInformationFooterLink() {
  const path = usePathname().replace(/\/$/, '');
  return path === '/student-information-system'
    ? <span className="footer-current-product" aria-current="page">Student Information System</span>
    : <Link href="/student-information-system/">Student Information System</Link>;
}
