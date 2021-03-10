import siteMetadata from '@/data/siteMetadata'
import axios from 'axios'
import Card from '@/components/Card'
import { PageSeo } from '@/components/SEO'
import { useEffect, useState } from 'react'

export default function Projects() {
  const [posts, setPost] = useState([]);
  
  useEffect((  ) => {
    getStaticProps();
  },[]);

  async function getStaticProps() {
    try{
      const getRepos = await axios.get(`https://api.github.com/users/moroleandro/repos?per_page=10`);
      setPost(getRepos.data);
    }catch(err){
      return { props: {}}
    }
  }

  return (
    <>
      <PageSeo
        title={`Projects - ${siteMetadata.author}`}
        description={siteMetadata.description}
        url={`${siteMetadata.siteUrl}/projects`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-4 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            My latest Github projects
          </p>
        </div>
        <div className="container py-4">
          <div className="flex flex-wrap -m-4">
            {posts.map(props => (
              <Card
                id={props.id}
                key={props.name}
                title={props.name}
                description={props.description}
                language={props.language}
                href={props.html_url}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
