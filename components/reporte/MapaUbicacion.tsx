interface Props {
  lat: number
  lng: number
  name: string
}

export default function MapaUbicacion({ lat, lng, name }: Props) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-100 h-full min-h-[220px]">
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block', minHeight: 220 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ubicación de ${name}`}
      />
    </div>
  )
}
