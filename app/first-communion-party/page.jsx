import SignupClient from './SignupClient';

export const metadata = {
  title: 'First Communion Class Party — Sign Up',
  description: 'Sign up to bring something to our First Communion class party.',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return <SignupClient />;
}
