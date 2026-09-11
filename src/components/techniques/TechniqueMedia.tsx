interface TechniqueMediaProps {
  imageUrl: string | null
  videoUrl: string | null
  altText: string
}

export default function TechniqueMedia({ imageUrl, videoUrl, altText }: TechniqueMediaProps) {
  if (videoUrl) {
    return (
      <div className="tc-media-wrapper">
        <video
          className="tc-media-video"
          controls
          preload="metadata"
          aria-label={`Vídeo da técnica: ${altText}`}
        >
          <source src={videoUrl} />
          Seu navegador não suporta vídeo HTML5.
        </video>
      </div>
    )
  }

  if (imageUrl) {
    return (
      <div className="tc-media-wrapper">
        <img
          className="tc-media-image"
          src={imageUrl}
          alt={altText}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className="tc-media-wrapper tc-media-placeholder" aria-hidden="true">
      <div className="tc-media-placeholder-inner">
        <span className="tc-media-placeholder-label">MÍDIA DA TÉCNICA</span>
        <span className="tc-media-placeholder-sub">image_url · video_url</span>
      </div>
    </div>
  )
}
