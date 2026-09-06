type Props = {
  latitude: number;
  longitude: number;
  label: string;
};

export function MapEmbed({ latitude, longitude, label }: Props) {
  const src = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

  return (
    <iframe
      title={label}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-80 w-full border-0 md:h-full md:min-h-[28rem]"
    />
  );
}
