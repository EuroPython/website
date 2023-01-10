import { Layout } from "../components/layout";
import { Hero } from "../components/hero";
import { Fullbleed } from "../components/layout/fullbleed";

export default function IndexPage() {
  return (
    <div className="grid items-center justify-center content-center min-h-screen">
      <Hero />
    </div>
  );
}
