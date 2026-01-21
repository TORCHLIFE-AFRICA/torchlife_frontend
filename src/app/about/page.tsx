import { Footer } from "@/src/components/landingPage/footer";
import AboutTorchLifePage from "@/src/components/landingPage/how-it-works-section";
import { Navbar } from "@/src/components/landingPage/navbar";

export default function AboutUs() {
  return (
    <div>
      <Navbar />
      <AboutTorchLifePage />;
      <Footer />
    </div>
  );
}
