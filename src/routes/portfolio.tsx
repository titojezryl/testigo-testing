import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { Page } from "~/components/Page";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const PROJECTS = [
  {
    title: "Checklist Runner",
    description: "Mark and review QA cases without leaving the document.",
  },
  {
    title: "Defect Tracker",
    description: "Log fails, attach evidence, and close the loop with developers.",
  },
  {
    title: "Merge Gate",
    description: "Block a PR until the required QA docs are complete.",
  },
];

function PortfolioPage() {
  return (
    <Page className="max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Home
        </Link>
      </Button>

      <header className="mb-10">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Sample portfolio
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Alex Rivera
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Frontend engineer. I build dense, readable tools for QA teams.
        </p>
        <Button asChild className="mt-6">
          <a href="mailto:alex@example.com">
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Email me
          </a>
        </Button>
      </header>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="mb-4 text-xl font-semibold">
          Projects
        </h2>
        <ul className="grid gap-3.5">
          {PROJECTS.map((project) => (
            <li key={project.title}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
});
