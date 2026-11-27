import Home from './components/Home';
import { loadContents } from './lib/content';

// Server component: runs at build time (static export) and hands the Markdown texts to the client app.
export default function Page() {
    return <Home contents={loadContents()} />;
}
