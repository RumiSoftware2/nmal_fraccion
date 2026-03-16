import 'katex/dist/katex.min.css'
import katex from 'katex'

export default function BlockMath({ math }) {
  const html = katex.renderToString(math, { throwOnError: false, displayMode: true })
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
