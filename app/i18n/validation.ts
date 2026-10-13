import messages from "@/app/messages/pt-PT.json";

export type ValidationTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export const defaultValidationTranslator: ValidationTranslator = (key, values) => {
  const name = key.replace(/^Validation\./, "") as keyof typeof messages.Validation;
  return messages.Validation[name].replace(/\{(\w+)\}/g, (placeholder, variable) =>
    String(values?.[variable] ?? placeholder),
  );
};
