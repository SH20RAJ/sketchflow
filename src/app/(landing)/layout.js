import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavBar from "@/components/landing/LandingNavBar";

export default function layout({ children }) {
  return (
    <>
      <LandingNavBar />
      <div className="bg-gradient-to-b from-white to-blue-50  pb-20">
        <div className="">{children}</div>
      </div>
      <LandingFooter />
    </>
  );
}
