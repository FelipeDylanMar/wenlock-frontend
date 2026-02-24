import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/pages/Home'
import { UsersPage, UserCreatePage, UserEditPage, UserViewPage } from '@/modules/users/pages'
import '@/styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/usuarios/novo" element={<UserCreatePage />} />
          <Route path="/usuarios/:id" element={<UserViewPage />} />
          <Route path="/usuarios/:id/editar" element={<UserEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
