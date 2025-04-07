"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Alert variant="destructive" className="mx-auto max-w-md">
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="mt-4 text-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la pagina principală
          </Button>
        </Link>
      </div>
    </div>
  );
}
