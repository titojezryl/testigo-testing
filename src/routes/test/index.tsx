import { createFileRoute } from "@tanstack/react-router";
import TestPage from "~/components/test";

export const Route = createFileRoute("/test/")({
  component: Test,
});

function Test() {
  return (
    <div>
      <TestPage />
    </div>
  );
}
