import { BrowserRouter, Routes, Route } from "react-router";
import Portfolio from './components'
import BlogDetail from "./pages/blog-detail";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
