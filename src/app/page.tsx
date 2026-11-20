import HeroSection from "@/components/home/hero-section";
import FeaturedServicesSection from "@/components/home/featured-services-section";
import CategoriesSection from "@/components/home/categories-section";
import WhyChooseSection from "@/components/home/why-choose-section";
import HowItWorksSection from "@/components/home/how-it-works-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedServicesSection />
      <CategoriesSection />
      <WhyChooseSection />
      <HowItWorksSection />
    </>
  );
}