import i18n from "$/utils/i18n";

export type ValidationErrorKey = "field_cannot_be_blank";

export const validationErrorMessages: Record<ValidationErrorKey, () => string> = {
    field_cannot_be_blank: () => i18n.t("Field cannot be blank"),
};

export type ValidationError<T> = {
    property: keyof T;
    value: unknown;
    errors: ValidationErrorKey[];
};
