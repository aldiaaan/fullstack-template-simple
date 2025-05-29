import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home" }, { name: "description", content: "Home" }];
}

export default function Home() {
  return (
    <div className="container mx-auto pt-8">
      <h3 className="text-3xl font-semibold tracking-tight">Home</h3>
    </div>
  );
}
