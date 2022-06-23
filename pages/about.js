import Head from 'next/head';
import Link from 'next/link';

const about = () => {
  return (
    <div className="container">
      <h1>Welcome to eventby </h1>
      <Link href="/">
        <a> Organizer</a>
      </Link>
    </div>
  )
}


about.layout = "Event";
export default about;
