import Practice from './pages/Practice';
import Progress from './pages/Progress';
import Library from './pages/Library';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Practice": Practice,
    "Progress": Progress,
    "Library": Library,
}

export const pagesConfig = {
    mainPage: "Practice",
    Pages: PAGES,
    Layout: __Layout,
};