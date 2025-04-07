"use client";

import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface FormActionsProps {
  isSubmitting: boolean;
  isUploading: boolean;
  submitError?: string;
}

export default function FormActions({
  isSubmitting,
  isUploading,
  submitError,
}: FormActionsProps) {
  return (
    <div className="space-y-4">
      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-end gap-4 pt-4">
        <Link href="/map">
          <Button type="button" variant="outline">
            Anulează
          </Button>
        </Link>

        <Button
          type="submit"
          className="bg-amber-500 text-white hover:bg-amber-600"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Se salvează...
            </>
          ) : isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Se încarcă...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvează locația
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
