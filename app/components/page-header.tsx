interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-gray-50 py-8 mb-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
      </div>
    </div>
  )
}
