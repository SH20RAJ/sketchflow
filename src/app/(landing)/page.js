import LandingPage from "@/components/landing/landingpage";
import { metadata } from './metadata';

// Re-export the metadata for this page
export { metadata };

export default function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}
