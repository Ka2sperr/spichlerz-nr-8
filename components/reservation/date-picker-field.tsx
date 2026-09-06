"use client";

type Props = {
  id: string;
  name: string;
  min: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function DatePickerField({
  id,
  name,
  min,
  defaultValue,
  onChange,
  ...aria
}: Props) {
  return (
    <input
      type="date"
      id={id}
      name={name}
      min={min}
      defaultValue={defaultValue}
      required
      onChange={(event) => onChange?.(event.target.value)}
      className="border-ink/30 bg-paper w-full border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      {...aria}
    />
  );
}
