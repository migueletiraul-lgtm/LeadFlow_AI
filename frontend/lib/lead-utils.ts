import type {
  Lead,
  NextActionPriority,
} from "@/lib/types";

export type OpportunityInsight = {
  title: string;
  description: string;
  points?: string;
  tone: "high" | "medium" | "positive";
};

export type AIRecommendation = {
  score: number;
  level: "Alta" | "Média" | "Baixa";
  color: "green" | "yellow" | "red";
  channel:
    | "WhatsApp"
    | "Instagram"
    | "Website"
    | "Telefone";
  nextAction: string;
  reasons: string[];
};

export const NEXT_ACTION_PRIORITY_STYLES: Record<
  NextActionPriority,
  string
> = {
  "alta": "border-red-200 bg-red-50 text-red-700",
  "média": "border-amber-200 bg-amber-50 text-amber-700",
  "baixa": "border-slate-200 bg-slate-100 text-slate-700",
};

export function getScoreLabel(score: number) {
  if (score >= 80) {
    return "Muito quente";
  }

  if (score >= 60) {
    return "Quente";
  }

  return "Regular";
}

export function getScoreAccentClasses(score: number) {
  if (score >= 80) {
    return {
      text: "text-red-700",
      badge:
        "border-red-200 bg-red-50 text-red-700",
      bar: "bg-red-500",
      glow: "from-red-50 to-orange-50",
      icon: "text-red-600",
    };
  }

  if (score >= 60) {
    return {
      text: "text-amber-700",
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
      bar: "bg-amber-500",
      glow: "from-amber-50 to-yellow-50",
      icon: "text-amber-600",
    };
  }

  return {
    text: "text-slate-700",
    badge:
      "border-slate-200 bg-slate-100 text-slate-700",
    bar: "bg-slate-400",
    glow: "from-slate-50 to-slate-100",
    icon: "text-slate-600",
  };
}

export function normalizeWebsiteUrl(
  website: string,
) {
  const value = website.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://${value}`;
}

export function normalizeInstagramUrl(
  instagram: string,
) {
  const username = instagram
    .trim()
    .replace(
      /^https?:\/\/(www\.)?instagram\.com\//i,
      "",
    )
    .replace(/^@/, "")
    .replace(/\/+$/, "");

  return `https://instagram.com/${username}`;
}

export function normalizeWhatsAppUrl(
  whatsapp: string,
) {
  const phone = whatsapp.replace(/\D/g, "");

  return `https://wa.me/${phone}`;
}

export function buildWhatsAppUrl(
  whatsapp: string,
  message: string,
) {
  const phone = whatsapp.replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;
}

export function getCompanyInitial(name: string) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "E";
  }

  return normalizedName
    .charAt(0)
    .toLocaleUpperCase("pt-BR");
}

export function generateLocalApproach(
  lead: Lead,
  variation: number,
) {
  const companyName =
    lead.name?.trim() || "sua empresa";

  const niche =
    lead.niche?.trim() || "seu segmento";

  const city = lead.city?.trim();

  const hasWebsite = Boolean(
    lead.website?.trim(),
  );

  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );

  const rating = lead.google_rating;
  const score = lead.lead_score;

  const locationText = city
    ? `, de ${city}`
    : "";

  const ratingCompliment =
    rating !== null &&
    rating !== undefined &&
    rating >= 4.5
      ? `Também vi que vocês têm uma ótima avaliação no Google (${rating}), o que mostra que o trabalho da empresa já é bem reconhecido pelos clientes.`
      : rating !== null &&
          rating !== undefined &&
          rating >= 4
        ? `Vi também que vocês têm uma boa avaliação no Google (${rating}), um ponto positivo para fortalecer ainda mais a presença digital da empresa.`
        : "";

  const digitalOpportunity = !hasWebsite
    ? "Percebi que vocês ainda não possuem um site próprio. Existe uma boa oportunidade de apresentar os serviços com mais profissionalismo, facilitar o contato e transformar pesquisas no Google em novos clientes."
    : "Vi que vocês já possuem presença online. Ainda assim, pode haver oportunidades de melhorar a apresentação dos serviços e facilitar o contato.";

  const presenceOpportunity =
    !hasWebsite && !hasInstagram
      ? "Como a presença digital ainda parece pouco estruturada, uma página simples e profissional pode ser um ótimo primeiro passo para gerar mais confiança."
      : !hasInstagram
        ? "Uma presença digital mais integrada também pode ajudar a empresa a ser encontrada com mais facilidade."
        : "";

  const priorityCta =
    score >= 80
      ? "Se fizer sentido, posso montar uma ideia rápida e personalizada para vocês, sem compromisso. Posso te mostrar?"
      : score >= 60
        ? "Posso te mostrar uma sugestão rápida de como isso poderia funcionar para vocês?"
        : "Faria sentido eu te enviar uma ideia simples para melhorar essa presença online?";

  const openings = [
    `Olá! Tudo bem? Meu nome é Raul e encontrei a ${companyName}${locationText} enquanto pesquisava empresas do segmento de ${niche}.`,
    `Oi! Tudo bem? Estava pesquisando empresas de ${niche}${city ? ` em ${city}` : ""} e encontrei a ${companyName}.`,
    `Olá! Tudo certo? Conheci a ${companyName}${locationText} enquanto analisava negócios do segmento de ${niche} na região.`,
    `Oi! Tudo bem? Dei uma olhada na presença digital da ${companyName}${locationText} e achei interessante entrar em contato.`,
  ];

  const serviceTexts = [
    "Eu trabalho com criação de sites e páginas focadas em apresentar o negócio de forma profissional e gerar mais oportunidades de contato.",
    "Meu trabalho é ajudar empresas a terem uma presença online mais profissional, com páginas pensadas para facilitar o contato de novos clientes.",
    "Eu desenvolvo sites e páginas comerciais com foco em credibilidade, apresentação dos serviços e geração de novos contatos.",
    "Trabalho criando soluções digitais simples e profissionais para empresas que querem melhorar sua presença online.",
  ];

  const variationIndex =
    Math.abs(variation) % openings.length;

  const paragraphs = [
    openings[variationIndex],
  ];

  if (ratingCompliment) {
    paragraphs.push(ratingCompliment);
  }

  paragraphs.push(digitalOpportunity);

  if (presenceOpportunity) {
    paragraphs.push(presenceOpportunity);
  }

  paragraphs.push(
    serviceTexts[variationIndex],
  );

  paragraphs.push(priorityCta);

  return paragraphs.join("\n\n");
}

export function getOpportunityInsights(
  lead: Lead,
): OpportunityInsight[] {
  const insights: OpportunityInsight[] = [];

  const hasWebsite = Boolean(
    lead.website?.trim(),
  );

  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );

  if (!hasWebsite) {
    insights.push({
      title: "Não possui site",
      description:
        "Alta oportunidade para oferecer criação de site ou landing page profissional.",
      points: "+25",
      tone: "high",
    });
  }

  if (!hasInstagram) {
    insights.push({
      title: "Sem Instagram identificado",
      description:
        "A presença digital pode estar pouco estruturada, abrindo espaço para uma solução mais completa.",
      points: "+20",
      tone: "high",
    });
  }

  if (
    lead.google_reviews !== null &&
    lead.google_reviews !== undefined
  ) {
    if (lead.google_reviews < 20) {
      insights.push({
        title: "Poucas avaliações no Google",
        description:
          "A empresa ainda possui pouca prova social e pode se beneficiar de uma presença digital mais forte.",
        points: "+15",
        tone: "medium",
      });
    } else if (lead.google_reviews < 100) {
      insights.push({
        title:
          "Volume moderado de avaliações",
        description:
          "Existe espaço para fortalecer autoridade e presença online.",
        points: "+8",
        tone: "medium",
      });
    }
  }

  if (
    lead.google_rating !== null &&
    lead.google_rating !== undefined
  ) {
    if (lead.google_rating >= 4.5) {
      insights.push({
        title:
          "Excelente reputação no Google",
        description: `Nota ${lead.google_rating} é um ponto forte que pode ser usado na abordagem comercial.`,
        tone: "positive",
      });
    } else if (lead.google_rating < 4.2) {
      insights.push({
        title:
          "Reputação digital pode melhorar",
        description: `A nota ${lead.google_rating} indica uma oportunidade de fortalecer confiança e posicionamento online.`,
        points: "+15",
        tone: "medium",
      });
    } else {
      insights.push({
        title: "Boa avaliação no Google",
        description: `Nota ${lead.google_rating} demonstra uma base positiva para fortalecer a presença digital.`,
        tone: "positive",
      });
    }
  }

  if (lead.lead_score >= 80) {
    insights.push({
      title: "Lead de alta prioridade",
      description:
        "O score indica uma oportunidade comercial muito quente. Vale priorizar o contato.",
      tone: "high",
    });
  } else if (lead.lead_score >= 60) {
    insights.push({
      title:
        "Boa oportunidade comercial",
      description:
        "O score indica um lead quente e com bom potencial para prospecção.",
      tone: "medium",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title:
        "Presença digital estruturada",
      description:
        "Não foram identificadas lacunas evidentes. A abordagem pode focar em otimização e conversão.",
      tone: "positive",
    });
  }

  return insights;
}

export function getAIRecommendation(
  lead: Lead,
): AIRecommendation {
  let score = lead.lead_score;

  const reasons: string[] = [];

  const hasWebsite = Boolean(
    lead.website?.trim(),
  );

  const hasInstagram = Boolean(
    lead.instagram?.trim(),
  );

  const hasWhatsApp = Boolean(
    lead.whatsapp?.trim(),
  );

  if (!hasWebsite) {
    score += 10;
    reasons.push(
      "A empresa não possui um website identificado.",
    );
  }

  if (!hasInstagram) {
    score += 5;
    reasons.push(
      "O Instagram da empresa não foi identificado.",
    );
  }

  if (
    lead.google_rating !== null &&
    lead.google_rating !== undefined &&
    lead.google_rating >= 4.5
  ) {
    score += 5;
    reasons.push(
      "A empresa possui excelente reputação no Google.",
    );
  }

  if (
    lead.google_reviews !== null &&
    lead.google_reviews !== undefined &&
    lead.google_reviews < 20
  ) {
    score += 5;
    reasons.push(
      "A empresa possui poucas avaliações no Google.",
    );
  }

  score = Math.min(
    100,
    Math.max(0, score),
  );

  let level: AIRecommendation["level"];

  if (score >= 85) {
    level = "Alta";
  } else if (score >= 60) {
    level = "Média";
  } else {
    level = "Baixa";
  }

  const color: AIRecommendation["color"] =
    level === "Alta"
      ? "green"
      : level === "Média"
        ? "yellow"
        : "red";

  let channel: AIRecommendation["channel"];

  if (hasWhatsApp) {
    channel = "WhatsApp";
  } else if (hasInstagram) {
    channel = "Instagram";
  } else if (hasWebsite) {
    channel = "Website";
  } else {
    channel = "Telefone";
  }

  const nextAction =
    level === "Alta"
      ? "Entrar em contato nas próximas 24 horas."
      : level === "Média"
        ? "Realizar o primeiro contato ainda esta semana."
        : "Manter o lead no radar e revisar posteriormente.";

  if (reasons.length === 0) {
    reasons.push(
      "A presença digital da empresa está relativamente estruturada.",
    );
  }

  return {
    score,
    level,
    color,
    channel,
    nextAction,
    reasons,
  };
}