import { Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import SearchExcel from './pages/SearchExcel';
import locale from 'antd/locale/ko_KR';
import AppLayout from './components/AppLayout';
import SearchLayout from './components/SearchLayout';
import CheckLayout from './components/CheckLayout';
import SearchUpload from './pages/SearchUpload';
import CheckUpload from './pages/CheckUpload';
import CheckDb from './pages/CheckDb';
import CheckInclude from './pages/CheckInclude';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3fa3aeff',
          colorPrimaryHover: '#57bac5ff', // 기본보다 약간 밝게
          colorPrimaryActive: '#387a83' // Active는 여전히 어둡게
        }
      }}
      locale={locale}>

      <Routes>
        <Route element={<AppLayout />}>
            {/* ✅ / -> /search/excel 로 리다이렉트 */}
          <Route index element={<Navigate to="/search/excel" replace />} />

          <Route path="search" element={<SearchLayout />}>
            <Route index element={<Navigate to="excel" replace />} />
            <Route path="excel" element={<SearchExcel />} />
            <Route path="upload" element={<SearchUpload />} />
          </Route>

          <Route path="check" element={<CheckLayout />}>
            <Route index element={<Navigate to="include" replace />} />
            <Route index path="include" element={<CheckInclude/>} />
            <Route index path="db" element={<CheckDb/>} />
            <Route index path="upload" element={<CheckUpload />} />

          </Route>
        </Route>
      </Routes>

    </ConfigProvider>
  );
};

export default App;