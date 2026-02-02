import parse, { type HTMLReactParserOptions, Element } from 'html-react-parser'
import { useEffect, useState } from 'react'
import { renderMarkdown, type MarkdownResult } from '@/utils/markdown'

type MarkdownProps = {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null)

  useEffect(() => {
    renderMarkdown(content).then(setResult)
  }, [content])

  if (!result) {
    return (
      <div className={className}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-32 bg-gray-200 rounded w-full" />
        </div>
      </div>
    )
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === 'img') {
          return (
            <img
              {...domNode.attribs}
              loading="lazy"
              className="rounded-lg shadow-md max-w-full h-auto"
            />
          )
        }
      }
    },
  }

  return (
    <div className={className}>
      {parse(result.markup, options)}
    </div>
  )
}
