"use client";

import { useState } from "react";
import {
  CalendarClock,
  CalendarCheck2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/types";
import { updateCompanyStatus } from "@/services/api";
import { createLeadInteraction } from "@/services/interactions";

type MeetingActionProps = {
  lead: Lead;
  onLeadUpdated?: (lead: Lead) => void;
};

function normalizeStatus(
  status: string | null | undefined,
) {
  return (
    status?.trim().toLocaleLowerCase("pt-BR") ??
    "novo"
  );
}

export default function MeetingAction({
  lead,
  onLeadUpdated,
}: MeetingActionProps) {
  const [meetingAt, setMeetingAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const currentStatus = normalizeStatus(lead.status);
  const canRegisterMeeting =
    currentStatus === "respondeu";
  const alreadyScheduled = [
    "reunião",
    "proposta",
    "cliente",
  ].includes(currentStatus);

  async function handleRegisterMeeting() {
    if (isSaving || !canRegisterMeeting) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedLead = await updateCompanyStatus(
        lead.id,
        "Reunião",
      );

      await createLeadInteraction(lead.id, {
        interaction_type: "reuniao",
        description: "Reunião registrada.",
        follow_up_at: meetingAt || null,
      });

      onLeadUpdated?.(updatedLead);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a reunião.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <CalendarCheck2 className="h-5 w-5 text-violet-600" />

        <div>
          <h3 className="font-semibold text-slate-950">
            Reunião
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Registre quando uma reunião for marcada
            com este lead.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {alreadyScheduled ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Reunião já registrada para este lead.
          </div>
        ) : canRegisterMeeting ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor={`meeting-at-${lead.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Data e hora da reunião
              </label>

              <p className="mt-1 text-xs text-slate-400">
                Opcional
              </p>

              <div className="relative mt-2">
                <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id={`meeting-at-${lead.id}`}
                  type="datetime-local"
                  value={meetingAt}
                  disabled={isSaving}
                  onChange={(event) => {
                    setMeetingAt(
                      event.target.value,
                    );

                    setErrorMessage("");
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleRegisterMeeting}
              disabled={isSaving}
            >
              <CalendarCheck2 className="h-4 w-4" />
              {isSaving
                ? "Registrando..."
                : "Registrar reunião"}
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Aguardando resposta do lead para
            registrar a reunião.
          </div>
        )}

        {errorMessage && (
          <p className="mt-3 text-xs font-medium text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
