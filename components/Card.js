import Image from 'next/image'
import Link from '@/components/Link'

const Card = ({ id, title, description, language, href }) => (
  <div className="flex flex-col p-6 md:w-1/2" style={{ maxWidth: '544px' }}>
    <div className="h-full border-2 border-gray-200 border-opacity-60 dark:border-gray-700 rounded-md overflow-hidden">
     
      <div className="p-6">
        <h2 className="text-2xl font-bold leading-6 tracking-tight mb-2">
          <Link href={href} aria-label={`Link to ${title}`}>
            {title}
          </Link>
        </h2>
        <p className="prose text-gray-500 max-w-none dark:text-gray-400 mb-3">{description}</p>
        {language ? (
          <p className="prose text-gray-500 max-w-none dark:text-gray-400 mb-3">Language: {language}</p>
        ) : (
          ""
          )}
        {href && (
          <Link
            id={id}
            href={href}
            className="text-base font-medium leading-6 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label={`Link to ${title}`}
          >
            View &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
