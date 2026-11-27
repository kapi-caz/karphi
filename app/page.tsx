import Home from './components/Home';
import { loadContents } from './lib/content';

// Server component: runs at build time (static export) and hands the Markdown texts and pages to the client app.
export default function Page() {
    const { texts, pages } = loadContents();
    return <Home texts={texts} pages={pages} />;
}
