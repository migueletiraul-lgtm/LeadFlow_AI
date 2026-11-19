"use client";

import { type FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuditInputProps = {
  onSubmit: (target: string) => void | Promise<void>;
  placeholder?: string;
};

const URL_PATTERN =
  /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

const INSTAGRAM_HANDLE_PATTERN = /^@[a-z0-9._]{1,30}$/i;

function isValidTarget(value: string) {
  return (
    URL_PATTERN.test(value) ||
    INSTAGRAM_HANDLE_PATTERN.test(value)
  );
}

export default function AuditInput({
  onSubmit,
  placeholder,
}: AuditInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasError = Boolean(error);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const target = value.trim();

    if (!target) {
      setError(
        "Informe um site ou @usuário do Instagram.",
      );

      return;
    }

    if (!isValidTarget(target)) {
      setError(
        "Digite uma URL válida (ex.: seusite.com) ou um @usuário do Instagram.",
      );

      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await onSubmit(target);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label
            htmlFor="audit-target"
            className="sr-only"
          >
            Website ou Instagram
          </label>

          <Input
            id="audit-target"
            value={value}
            disabled={isLoading}
            placeholder={
              placeholder ??
              "seusite.com ou @seuinstagram"
            }
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? "audit-target-error"
                : undefined
            }
            onChange={(event) => {
              setValue(event.target.value);

              if (error) {
                setError("");
              }
            }}
            className={`h-12 rounded-xl border bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 ${
              hasError
                ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-100"
                : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
            }`}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-12 gap-2 px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              Iniciar Auditoria
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {hasError && (
        <p
          id="audit-target-error"
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </form>
  );
}
